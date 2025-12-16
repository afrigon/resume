import * as cdk from "aws-cdk-lib"
import { ResumeStack } from "../lib/resume.js"

const app = new cdk.App()

new ResumeStack(app, "Resume", { 
    description: "This stack includes resources needed for my resume on alexandre.frigon.app"
})
