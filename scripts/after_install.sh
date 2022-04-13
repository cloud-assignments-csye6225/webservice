#!/bin/bash

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/tmp/app_patch/AmazonCloudWatch-Log.json -s
sudo /bin/systemctl status amazon-cloudwatch-agent
sudo /bin/systemctl stop amazon-cloudwatch-agent
sudo /bin/systemctl start amazon-cloudwatch-agent