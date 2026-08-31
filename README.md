# resume

Personal resume, published as a static site at
[alexandre.frigon.app](https://alexandre.frigon.app). A React and
TypeScript single-page app built with Vite and Tailwind CSS, featuring a
WebGL liquid gradient background and an animated project showcase.

## Development

Run the dev server:

```sh
aubr start
```

Build the production bundle into `dist`, or preview it locally:

```sh
aubr build
aubr serve
```

Lint and format:

```sh
aubr lint
aubr prettier
```

## Deployment

Pushing a tag triggers the deploy workflow: Terraform provisions the S3
bucket and CloudFront distribution from `terraform/`, then the built site
is synced to the bucket and the CDN cache is invalidated.
