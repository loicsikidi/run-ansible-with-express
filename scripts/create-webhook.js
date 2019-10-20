const Octokit = require('@octokit/rest');

/* Script to Create a Github Webhook */

// configuration
const personalAccessToken = ""  // personal access token
const webhookSecret = "" // random string
const repoOwner = "" // your username
const repoName = "" // username/repo-name  or organisation/repo-name
const webhookPayloadUrl = "" // https://...

async function createPushWebhook (conf) {

  const octokit = new Octokit({
    auth: personalAccessToken
  });

  const res = await octokit.repos.createHook({
    owner: conf.owner,
    repo: conf.repo,
    name: 'web',
    config: {
      url: conf.url,
      content_type: 'json',
      secret: webhookSecret,
      insecure_ssl: 0,
    },
    events: [
      'push'
    ]
  }).catch(e => {
    console.log('Error: ', e)
  });
  console.log('Success: Hook id: ' + res.data.id)
}

createPushWebhook({
  owner: repoOwner,
  repo: repoName,
  url: webhookPayloadUrl
});