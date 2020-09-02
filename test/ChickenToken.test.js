const { expectRevert } = require('@openzeppelin/test-helpers');
const ChickenToken = artifacts.require('ChickenToken');

contract('ChickenToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.chicken = await ChickenToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.chicken.name();
        const symbol = await this.chicken.symbol();
        const decimals = await this.chicken.decimals();
        assert.equal(name.valueOf(), 'ChickenToken');
        assert.equal(symbol.valueOf(), 'CHICK');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.chicken.mint(alice, '100', { from: alice });
        await this.chicken.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.chicken.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.chicken.totalSupply();
        const aliceBal = await this.chicken.balanceOf(alice);
        const bobBal = await this.chicken.balanceOf(bob);
        const carolBal = await this.chicken.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.chicken.mint(alice, '100', { from: alice });
        await this.chicken.mint(bob, '1000', { from: alice });
        await this.chicken.transfer(carol, '10', { from: alice });
        await this.chicken.transfer(carol, '100', { from: bob });
        const totalSupply = await this.chicken.totalSupply();
        const aliceBal = await this.chicken.balanceOf(alice);
        const bobBal = await this.chicken.balanceOf(bob);
        const carolBal = await this.chicken.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.chicken.mint(alice, '100', { from: alice });
        await expectRevert(
            this.chicken.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.chicken.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
