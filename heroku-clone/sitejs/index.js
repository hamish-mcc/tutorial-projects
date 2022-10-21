const auto = require("@pulumi/pulumi/automation");
const aws = require("@pulumi/aws");
const process = require("process");

const args = process.argv.slice(2);
let destroy = false;

if (args.length > 0 && args[0]) {
  destroy = args[0] === "destroy";
}

const run = async () => {
  const pulumiProgram = async () => {
    // Create a bucket and expose a website index document
    const siteBucket = new aws.s3.Bucket("s3-website-bucket", {
      website: {
        indexDocument: "index.html",
      },
    });

    const indexContent = `
    <html>
    <head>
        <title>Hello S3</title>
    </head>
    <body>
        <p>Hello, <b>world!</b></p>
    </body>
    </html>
    `;

    // Write index.html into the site bucket
    let object = new aws.s3.BucketObject("index", {
      bucket: siteBucket,
      content: indexContent,
      contentType: "text/html; charset=utf-8",
    });

    // Create an S3 Bucket Policy to allow public read of all objects in bucket
    function publicReadPolicyForBucket(bucketName) {
      return {
        Version: "2012-10-17",
        Statement: {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      };
    }

    // Set the access policy for the bucket so all objects are readable
    new aws.s3.BucketPolicy("bucketPolicy", {
      bucket: siteBucket.bucket,
      policy: siteBucket.bucket.apply(publicReadPolicyForBucket),
    });

    return {
      websiteUrl: siteBucket.websiteEndpoint,
    };
  };

  // Create stack
  const args = {
    stackName: "dev",
    projectName: "inline",
    program: pulumiProgram,
  };

  // create (or select if one already exists) a stack that uses our inline program
  const stack = await auto.LocalWorkspace.createOrSelectStack(args);
  await stack.workspace.installPlugin("aws", "v4.0.0");
  await stack.setConfig("aws:region", { value: "ap-southeast-2" });
  await stack.refresh({ onOutput: console.info });

  if (destroy) {
    await stack.destroy({ onOutput: console.info });
    console.info("stack destroy complete");
    process.exit(0);
  }

  console.info("updating stack...");
  const upRes = await stack.up({ onOutput: console.info });
  console.info(
    `update summary: \n${JSON.stringify(
      upRes.summary.resourceChanges,
      null,
      4
    )}`
  );
  console.info(`webiste url: https://${upRes.outputs.websiteUrl.value}/index`);
};

run().catch((err) => console.log(err));
