const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const DEFAULT_MESSAGE = "Hello World"

beforeEach(async() => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();


    // Use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({ data: bytecode, arguments: [DEFAULT_MESSAGE] })
     .send({ from: accounts[0], gas: '1000000' })

})

describe('Inbox Contract', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)
    });

    it('has a default message', async () => {
        let message = await inbox.methods.getMessage().call();
        assert.ok(message)
    });

    it('verify default message', async () => {
        let message = await inbox.methods.getMessage().call();
        assert.equal(message, DEFAULT_MESSAGE)
    });

    it('can change the message', async () => {
        const newMessage = 'bye!'
        
        await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
        let message = await inbox.methods.getMessage().call();
        assert.equal(message, newMessage)
    });

})