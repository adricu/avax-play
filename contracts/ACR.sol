//SPDX-License-Identifier: Unlicense

pragma solidity >=0.8.4 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ACR is ERC721Enumerable, Ownable, ERC721Burnable, ERC721Pausable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;
  bool private whitelist;
  bool private sale;
  uint256 private price;
  uint256 private maxMint;
  uint256 private maxSale;
  uint256 public constant MAX_ITEMS = 1000;
  string public baseTokenURI;
  address public constant DEV_ADDRESS = 0xCBCAd2A0abaB2aC7EA7D71113a779218C7052cA4;

  mapping(address => bool) private _presaleList;
  mapping(address => uint256) private _presaleListClaimed;

  constructor(string memory baseURI) ERC721("ACR", "ACR") {
    setBaseURI(baseURI);
    whitelist = true;
    sale = false;
    price = 0.05 ether;
    maxSale = 10;
    maxMint = 2;
  }

  modifier saleIsOpen() {
    require(totalSupply() <= MAX_ITEMS, "Sale ended");
    if (_msgSender() != owner()) {
      require(!paused(), "Pausable: paused");
    }
    _;
  }

  function mintReserve(uint256 _count, address _to) public onlyOwner {
    uint256 total = totalSupply();
    require(total <= MAX_ITEMS, "Sale ended");
    require(total + _count <= MAX_ITEMS, "Max limit");

    for (uint256 i = 0; i < _count; i++) {
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(_to, tokenId);
    }
  }

  function mint(address _to, uint256 _count) public payable saleIsOpen {
    uint256 total = totalSupply();
    require(total <= MAX_ITEMS, "Max items limit");
    require(total + _count <= MAX_ITEMS, "Max items limit");
    require(total + _count <= maxSale, "Max sale limit");
    require(_count <= maxMint, "Max mint limit");
    require(sale, "Sale is not active");
    require(msg.value >= getPrice(_count), "Value below price");

    if (whitelist == true) {
      require(_presaleList[_to], "You are not on the whitelist");
    }

    for (uint256 i = 0; i < _count; i++) {
      uint256 tokenId = _tokenIdCounter.current();
      _tokenIdCounter.increment();
      _safeMint(_to, tokenId);
    }
  }

  function getPrice(uint256 _count) public view returns (uint256) {
    return price.mul(_count);
  }

  function setMaxMint(uint256 _maxMint) external onlyOwner {
    maxMint = _maxMint;
  }

  function setMaxSale(uint256 _maxSale) external onlyOwner {
    maxSale = _maxSale;
  }

  function setPrice(uint256 _priceInWei) external onlyOwner {
    price = _priceInWei;
  }

  function addToPresaleList(address[] calldata addresses) external onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add the null address");

      _presaleList[addresses[i]] = true;
      _presaleListClaimed[addresses[i]] > 0 ? _presaleListClaimed[addresses[i]] : 0;
    }
  }

  function onPresaleList(address addr) external view returns (bool) {
    return _presaleList[addr];
  }

  function removeFromPresaleList(address[] calldata addresses) external onlyOwner {
    for (uint256 i = 0; i < addresses.length; i++) {
      require(addresses[i] != address(0), "Can't add the null address");

      _presaleList[addresses[i]] = false;
    }
  }

  function presaleListClaimedBy(address owner) external view returns (uint256) {
    require(owner != address(0), "Zero address not on Allow List");

    return _presaleListClaimed[owner];
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function setBaseURI(string memory baseURI) public onlyOwner {
    baseTokenURI = baseURI;
  }

  function walletOfOwner(address _owner) external view returns (uint256[] memory) {
    uint256 tokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }

    return tokenIds;
  }

  function pause(bool val) public onlyOwner {
    if (val == true) {
      _pause();
      return;
    }
    _unpause();
  }

  function whitelistActive() external view returns (bool) {
    return whitelist;
  }

  function saleActive() external view returns (bool) {
    return sale;
  }

  function toggleWhitelist() public onlyOwner {
    whitelist = !whitelist;
  }

  function toggleSale() public onlyOwner {
    sale = !sale;
  }

  function withdrawAll() public payable onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "No funds to withdraw");
    _payout(DEV_ADDRESS, address(this).balance);
  }

  function _payout(address _address, uint256 _amount) private {
    (bool success, ) = _address.call{value: _amount}("");
    require(success, "Transfer failed.");
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
