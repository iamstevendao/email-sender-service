# Email Sender Service
A NodeJS app uses the [iamstevendao/boilerplate-nodejs](https://github.com/iamstevendao/boilerplate-nodejs), as my solution for Cabcharge Full Stack Dev Challenge.

### About
- Send emails using [SendGrid](https://sendgrid.com) and [Sparkpost](https://www.sparkpost.com/), automatically switch to the other if one goes down.
- Call APIs with HTTP requests using [Popsicle](https://github.com/blakeembrey/popsicle).
- Form validation using AngularJS.

<p align="center">
  <img src="https://ncexfa.bn1302.livefilestore.com/y4mwcQJFgjeav0XgwM5ZVeuHxVzJCNyxXW0mlbRuf3Efyx1WRndZKNpm22zWri0a9_UgTtRDSJ8RzLTqkZLqFzPjNsONwqMpwY9EAcj8UjGvbJXfz3LSlpOAnOjbAtqEtpTqJ69wbGvw4bxVP2GDFTLna0zUduWhb9ouxBdHRDCFORFCHsblPv_5uXGSC9I-4poOQhwKs_tl8I8evufT2q7UQ?width=1024&height=660&cropmode=none" width="1024" height="660" />
  <img src="https://nceafa.bn1302.livefilestore.com/y4m7AvFoWOP7pig_QJw7RCl2RIbdFhVf2PTdL9IEFV8Z-Vi_li8BAgmY4I9cAMQZ4K3ABXbMzNEFxw4ZOkMQsjg2rShIebqCwQYLhhFSNipWhP97IIB52vsjndVyhESpltEGaBvP-IdXPp3-4Qp2p3dMSElfFeQFGOWAoGT41s4nzr6oZMV1sSp1c-J19KTC2DVvde9B7soq7nM5agdh4Yh8Q?width=1024&height=210&cropmode=none" width="1024" height="210" />
</p>

## Highlights
- **Back End**: **NodeJS**
- **Front End**: **AngularJS**
- **Template Engine**: **Pug**
- **CSS Framework**: **Bootstrap**
- **CSS Preprocessor**: **Less**
- **JQuery**

## Configuration
1. Create a file named `.env` in the root folder.
2. Add API credentials to `.env`:
   ```bash
   #SendGrid API key: https://sendgrid.com/docs/Classroom/Send/How_Emails_Are_Sent/api_keys.html
   SENDGRID_API_KEY=''
   #Sparkpost API key
   SPARKPOST_API_KEY=''
   #Session secret, can be a random string
   SESSION_SECRET=''
   #Specified PORT number (optional, default value is 3000)
   PORT=''
   ```
3. Build and Run
   ```bash
   npm install && node server.js
   ```
4. Open `localhost:3000` in your browser.    
   (If you specified `PORT` in the `.env` file in the step 2, you would need to open `localhost:<YourPORT>`).
5. Enjoy!

## License
This project is distributed under [MIT](https://github.com/blakeembrey/popsicle/blob/master/LICENSE) license.

made with &#x2764; by [Steven](https://github.com/iamstevendao).
