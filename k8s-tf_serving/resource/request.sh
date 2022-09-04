#!/bin/bash

while sleep 0.01;

do curl -d '{"instances": [1.0, 2.0, 5.0]}' -X POST http://192.168.1.136:30001/v1/models/half_plus_two:predict;

done
