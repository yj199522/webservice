export AWS_PROFILE=dev 
export AWS_ACCESS_KEY=AKIA5RYIE5PX72PMGCTG
export AWS_SECRET_KEY=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
export PACKER_LOG=1
packer build -var-file=var.json nodeApi.pkr.hcl 