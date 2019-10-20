const Octokit = require('@octokit/rest');

/* Script to Test a Github Webhook 
 * 
 * Expects a hook_id argument
 * E.g. node scripts/test-webhook.js 
 */

// configuration
const personalAccessToken = ""  // personal access token
const repoOwner = ""; // your username
const repoName = ""; // username/repo-name  or organisation/repo-name
const HookId = ""

async function testWebhook (conf) {

  const octokit = new Octokit({
    auth: personalAccessToken
  });

  const res = await octokit.repos.testPushHook({
    owner: conf.owner,
    repo: conf.repo,
    hook_id: conf.hook_id
  })
  .catch(e => {
      console.log(e)
  })
  console.log(res)
}

testWebhook({
  owner: repoOwner,
  repo: repoName,
  hook_id: HookId
});