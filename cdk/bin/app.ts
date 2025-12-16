import * as cdk from "aws-cdk-lib"
import { ResumeStack } from "../lib/resume.js"

const app = new cdk.App()

const env = { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION }

new ResumeStack(app, "Resume", { 
    description: "This stack includes resources needed for my resume on alexandre.frigon.app",
    env
})
