---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''
---

If your issue relates to the _Discovery Process_, please first follow the steps described in the implementation guide [Debugging the Discovery Component](https://aws-solutions.github.io/workload-discovery-on-aws/workload-discovery-on-aws/2.0/debugging-the-discovery-component.html)

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior.

**Expected behavior**
A clear and concise description of what you expected to happen.

**Please complete the following information about the solution:**

- [ ] Version: [e.g. v2.0.0]

To get the version of the solution, you can look at the description of the created CloudFormation stack. 
For example, "_Workload Discovery on AWS Main Template (SO0075a) - Solution - Main Template (uksb-abcdef12) **(version:v2.0.0)**_". If the description does not contain the version information, 
you can look at the mappings section of the template:

```yanl
Mappings:

  Solution:
    Constants:
      # ...
      SolutionVersion: v2.0.0
      # ...
```

- [ ] Region: [e.g. us-east-1]
- [ ] Was the solution modified from the version published on this repository?
- [ ] If the answer to the previous question was yes, are the changes available on GitHub?
- [ ] Have you checked your [service quotas](https://docs.aws.amazon.com/general/latest/gr/aws_service_limits.html) for the 
services this solution uses?
- [ ] Were there any errors in the CloudWatch Logs?

**Screenshots**
If applicable, add screenshots to help explain your problem (please **DO NOT include sensitive information**).

**Additional context**
Add any other context about the problem here.
