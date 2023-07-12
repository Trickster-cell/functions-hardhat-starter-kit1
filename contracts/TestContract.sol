// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Functions, FunctionsClient} from "./dev/functions/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
// import "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol"; // Once published
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/**
 * @title Functions Consumer contract
 * @notice This contract is a demonstration of using Functions.
 * @notice NOT FOR PRODUCTION USE
 */

contract TestContract is FunctionsClient, ERC20 {
  using Functions for Functions.Request;
  string private sourceCode;

  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

  address private relayer;
  address private owner;

  mapping(string => address) private sessionId2address;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event TransferredCoins(address indexed recieverAddress, uint256 tokenAmount);
  uint256 public ans;
  uint256 public tokenAmount = 5 * 10 ** uint256(decimals());

  constructor(
    address oracle,
    string memory _sourceCode,
    address _relayer
  ) FunctionsClient(oracle) ERC20("Yash Tokens", "YRJ") {
    sourceCode = _sourceCode;
    relayer = _relayer;
    owner = msg.sender;
  }

  function _checkRelayer() internal view {
    require(relayer == msg.sender, "Caller is not the relayer");
  }

  modifier onlyRelayer() {
    _checkRelayer();
    _;
  }

  function executeRequest(
    string memory source,
    bytes memory secrets,
    string[] memory args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public returns (bytes32) {

    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }
    if (args.length > 0) req.addArgs(args);

    bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
    latestRequestId = assignedReqID;
    return assignedReqID;
  }

  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    if (response.length > 0) {
      uint256 temp = abi.decode(response, (uint256));
      ans = temp;
      emit OCRResponse(requestId, response, err);
    }
  }

  function mapSessionId(string memory _sessionId) public {
    require(sessionId2address[_sessionId] == address(0), "Session id already mapped");
    sessionId2address[_sessionId] = msg.sender;
  }

  function getAddressFrmSessionId(string memory _sessionId) public view returns (address) {
    return sessionId2address[_sessionId];
  }

  function transferToken(
    string[] calldata args,
    bytes calldata secrets,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyRelayer {
    bytes32 requestId = executeRequest(sourceCode, secrets, args, subscriptionId, gasLimit);
    string memory sessionID = args[0];
    address receiver = getAddressFrmSessionId(sessionID);
    super._mint(receiver, tokenAmount);
    emit TransferredCoins(receiver, tokenAmount);
  }

  function updateOracleAddress(address oracle) public {
    require((msg.sender == owner), "Only the contract owner can call this function");
    setOracle(oracle);
  }

  // acbc

  function updateSourceCode(string memory _sourceCode) public {
    require((msg.sender == owner), "Only the contract owner can call this function");
    sourceCode = _sourceCode;
  }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public {
    require((msg.sender == owner), "Only the contract owner can call this function");
    addExternalRequest(oracleAddress, requestId);
  }

  function checkRelayer() public view returns (address) {
    require((msg.sender == owner), "Only the contract owner can call this function");
    return relayer;
  }

  function changeRelayer(address _relayer) public {
    require((msg.sender == owner), "Only the contract owner can call this function");
    relayer = _relayer;
  }
}
