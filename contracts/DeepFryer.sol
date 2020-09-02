pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract DeepFryer is ERC20("DeepFryer", "xCHICK"){
    using SafeMath for uint256;
    IERC20 public chicken;

    constructor(IERC20 _chicken) public {
        chicken = _chicken;
    }

    // Enter the bar. Pay some CHICKs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalChicken = chicken.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalChicken == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalChicken);
            _mint(msg.sender, what);
        }
        chicken.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your CHICKs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(chicken.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        chicken.transfer(msg.sender, what);
    }
}