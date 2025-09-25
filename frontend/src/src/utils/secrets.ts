export interface SecretRule {
  id: string;
  name: string;
  regex: RegExp;
  description: string;
}

export const SECRET_RULES: SecretRule[] = [{
  id: 'aws-access-key',
  name: 'AWS Access Key ID',
  regex: /A[SK]IA[0-9A-Z]{16}/g,
  description: 'Potential AWS Access Key ID found. These keys grant access to your AWS resources.',
}, {
  id: 'stripe-api-key',
  name: 'Stripe API Key',
  regex: /(?:r|s)k_(?:live|test)_[0-9a-zA-Z]{24}/g,
  description: 'Potential Stripe API Key found. This key can be used to make API requests on behalf of your Stripe account.',
}, {
  id: 'github-oauth-token',
  name: 'GitHub OAuth Token',
  regex: /ghp_[0-9a-zA-Z]{36}/g,
  description: 'Potential GitHub OAuth Token found. This token can be used to access the GitHub API with your permissions.',
}, ];
