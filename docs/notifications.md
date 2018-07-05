## SparkPost App Notifications
### What Are They Good For?

Sometimes it's useful to gently announce news related to our service through the app. The SparkPost app displays these "notifications" in a list under the Notification Center bell icon on the top navigation bar.

The notifications themselves are just small Markdown files with a few special features. When the app is built, all current notifications are built with it.

**Note: notifications are _not_ great for loud must-read type announcements like breaking changes, service disruption notices and the like**

## How To Create A Notification

Prerequisites:
 - Access to the SparkPost GitHub org and github.com/SparkPost/2web2ui
 - A web browser
 - Very basic knowledge of GitHub and Markdown

The steps:
1. Navigate to the UI repository and open the notifications folder [here](https://github.com/SparkPost/2web2ui/tree/master/src/notifications)
1. Click the "Create a new file" button to start a new file
1. Name your file like this: yyyy-mm-dd_title-with-dashes.md
    - e.g. 2018-11-14_is-my-birthday.md
1. Start your notification with a header like this, to give it a title, a publication time and an expiry time:
    ```
    ---
    title: Nov 14th Is My Birthday
    activeDate: 2018-08-01T12:00:00-04:00
    expirationDate: 2018-11-15T00:00:00-04:00
    ---
    ```
1. Write your notification content using Markdown
    - Top tip: most notifications are just plain text with maybe a link
    - [Here's a nice guide on Markdown](https://guides.github.com/features/mastering-markdown/)
    - There's a "Preview" tab you can use as you work
1. When you're ready, fill in the "Commit your file" form at the bottom of the page to describe the change you're making.
    - **Remember to select the "create a new branch for this commit and start a pull request" option**
1. Click "Commit new file"
    - This will send you to a "pul request" page showing your proposed additions.
    - You can get back here or to any pull request from [github.com/SparkPost/2web2ui/pulls](https://github.com/SparkPost/2web2ui/pulls)
1. Find someone to review your work and give them your pull request link
1. When you're ready to publish, announce your intent on the #team-ux-alerts channel first and make sure no-one else is already deploying anything.
1. When you're clear to publish, click the "merge pull request" button on your pull request page
    - This will begin the process of publishing your notification to our staging environment where you can view the results.
1. Also please click the "delete branch" button on your now-closed pull request since we no longer need it.
1. Once you and your reviewer have verified your notification in staging, you can deploy to production using Bamboo (ask a engineer to show you how).
