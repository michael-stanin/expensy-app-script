# expensy-app-script


# [Working with clasp](https://developers.google.com/apps-script/guides/clasp)
    - Check status -> clasp status
    - Download script project -> clasp pull
    - Upload script project -> clasp push
    - Upload continuously script project -> clasp push --watch
    - List project versions -> clasp versions
    - List deploymnets -> clasp deployments
    - Open project in Apps Script editor -> clasp open

    Deployment instructions
        1. Create new version -> clasp version [description]
        2. Create new deployment -> clasp deploy [version] [description]
            [Optional] clasp undeploy <deploymentId>
        3. [Optional] Update an existing deployment with a new version and description ->  clasp deploy 68  -d "Remove previous logging" -i AKfycbxwLsc2hWsUmRIsXk7QJhVqqJ_niCPdHsbZRb4cz0DkZ8KWDZ7wHqL8dbaRpOW2yx8d
    
# TODO
    - [Authentication](https://github.com/googleworkspace/apps-script-oauth2)