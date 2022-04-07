#!/bin/bash

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ec2-user/AmazonCloudWatch-Log.json -s
sudo /bin/systemctl status amazon-cloudwatch-agent
sudo /bin/systemctl stop amazon-cloudwatch-agent
sudo /bin/systemctl start amazon-cloudwatch-agent