// assuming we retrieve the address from the backend -fetch
// let boxaddress;
// retrieve new box address via: const boxContract = await this.governorHelper.getTokenAddress(
// proposalIdInput
// );
// if budget was transferred to this:
//   const childBalance = await this.provider.getBalance(boxContract);

//   console.log(
//     "Child contract balance: ",
//     parseInt(childBalance),
//     ethers.utils.formatEther(await proposalBudget)
//     //   ethers.utils.formatEther(newContract.balance)
//   );
// _____________________________________________________________________
// assuming that project governor and project nft have been successfully deployed
// otherwise deploy in js using:
// let nftAddress = await minterInstance.createNewContract.call("x", "x", 300);

//   const expectedProjGovAddress = await getExpectedContractAddress(this.signers.admin);

//   const newTokenFactory: ProjectNftToken__factory = await ethers.getContractFactory("ProjectNftToken");
//   const newTokenContract: ProjectNftToken = <ProjectNftToken> await newTokenFactory.connect(this.signers.admin).deploy(expectedProjGovAddress, this.governor.address);
//   await newTokenContract.deployed();

{
  /* // ____________ NEW PROJECT TOKEN INTERACTIONS _________________________
  const newBoxContract = new ethers.Contract(
    newContract,
    newBoxAbi.abi,
    this.provider
  );

  // set whitelist
  const localAddresses = [this.addr2.address, this.signers.admin.address];

  await newTokenContract
    .connect(this.signers.admin)
    .setWhitelist(localAddresses, {
      gasLimit: 250000,
    });

// deploy local GOv
  const localGovernor: ProjectGovernor__factory = await ethers.getContractFactory("ProjectGovernor");
  const localGov: ProjectGovernor= <ProjectGovernor> await localGovernor.connect(this.signers.admin).deploy(newTokenContract.address, this.timelock.address, this.governor.address, proposalIdInput);
  await localGov.deployed(); */
}
