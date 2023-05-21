# StealthSend

# What is StealthSend?

StealthSend is a powerful tool that uses stealth addresses to maintain the privacy of blockchain transactions. A stealth meta-address is a public address, containing a spending and viewing key that is derived from a accounts signature and secret. We use the ERC-6538 address registry to map the meta-address to your normal Ethereum address, so you can basically do an easy transfer without remembering any long meta-addresses. Based on elliptic curve cryptography a meta-address resolves to a variety of stealth addresses. So simply put, you can just send your ETH to that one address and it will always be redirected to a bunch of addresses, where the sender will have access to. An external observer will see that a payment has been made to an address but will not be able to identify the address to which it belongs.

# Use Cases

## DAO Employee Payment

In an era where privacy is paramount, StealthSend is an excellent tool for DAOs. DAOs can use StealthSend to pay their employees on a regular basis, ensuring that the payment transactions are anonymous and secure. This allows for the privacy of the DAO members to be maintained.

## Charitable Donations

Another potential use case for StealthSend is in the world of philanthropy. Charitable organisations can use this tool to receive donations privately. 

## E-commerce Transactions

StealthSend can also be used in e-commerce. Buyers can make payments without revealing their personal wallet addresses, thus maintaining their privacy. Sellers, on the other hand, can receive payments without their business wallet addresses being publicly linked to the transactions.

# Progress

Unfortunately, we were not able to develop a fully working PoC in time of the hackathon. The registry is working, but we still got some errors trying to generate the stealth address. 

# App
https://stealthsend.vercel.app

# Contracts
Deployed Contracts on Scroll:
Messenger (ERC-5564): 0xff50dd1c91503764dced165c528497b181517976
Registry(based on ERC-6538): 0x3e23079170caeb67653e0e514a5b911193e61c70
Handler (for the actual transfer of ETH): 0xf6e6ce97d2e1c9fc78e0973b72808b1f7c3eae72

