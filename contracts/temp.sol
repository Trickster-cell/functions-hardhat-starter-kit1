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

contract TempContract is FunctionsClient, ConfirmedOwner, ERC20 
{
  using Functions for Functions.Request;
  string private sourceCode;

  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    uint256 public ans;

    constructor(address oracle, string memory _sourceCode) FunctionsClient(oracle) ConfirmedOwner(msg.sender) ERC20("Yash Tokens", "YRJ")
    {
        sourceCode = _sourceCode;
    }
  

  function executeRequest(
    string calldata source,
    bytes calldata secrets,
    string[] calldata args,
    uint64 subscriptionId,
    uint32 gasLimit
  ) public onlyOwner returns (bytes32) {
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

  function fulfillRequest(
    bytes32 requestId, 
    bytes memory response, 
    bytes memory err
  ) internal override {
    latestResponse = response;
    latestError = err;
    if(response.length>0)
    {
      uint256 temp = abi.decode(response, (uint256));
      ans = temp;
      emit OCRResponse(requestId, response, err);
    }
  }


  
  function updateOracleAddress(address oracle) public onlyOwner {
    setOracle(oracle);
  }
  
    function updateSourceCode(string memory _sourceCode) public onlyOwner{
        sourceCode = _sourceCode;
    }

  function addSimulatedRequestId(address oracleAddress, bytes32 requestId) public onlyOwner {
      addExternalRequest(oracleAddress, requestId);
  }
  
}