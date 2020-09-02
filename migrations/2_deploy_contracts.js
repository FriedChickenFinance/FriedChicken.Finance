const Colonel = artifacts.require("Colonel");
const ChickenToken = artifacts.require("ChickenToken");

module.exports = function(deployer) {
    deployer.deploy(ChickenToken).then(function() {
        return deployer.deploy(Colonel, ChickenToken.address, "0x5fbe5eFcC895d0dAA99ACe1Ce6F97d1D77fc9cd7", '16', '10784000', '10830000');
    })
};
