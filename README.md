# expensy-app-script


# Working with clasp (https://developers.google.com/apps-script/guides/clasp)
    - Check status -> clasp status
    - Download script project -> clasp pull
    - Upload script project -> clasp push
    - List project versions -> clasp versions
    - List deploymnets -> clasp deployments
    - Open project in Apps Script editor -> clasp open

    Deployment instructions
        1. Create new version -> clasp version [description]
        2. Create new deployment -> clasp deploy [version] [description]
            [Optional] clasp undeploy <deploymentId>
        3. [Optional] Update an existing deployment with a new version and description -> clasp redeploy <deploymentId> <version> <description>
    