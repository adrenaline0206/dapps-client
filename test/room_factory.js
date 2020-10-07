const { EVMRevert, expectEvent } = require('@openzeppelin/test-helpers');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract(
  'RoomFactory',
  ([factoryOwner, roomOwner1, roomOwner2, roomOwner3]) => {
    const RoomFactory = artifacts.require('RoomFactory');
    let roomFactory;

    describe('as an instance', () => {
      beforeEach(async function () {
        roomFactory = await RoomFactory.new({ from: factoryOwner });
      });

      it('should exist', function () {
        roomFactory.should.exist;
      });

      describe('createRoom', () => {
        const amount = web3.utils.toWei('1', 'ether');

        it('should create a room', async function () {
          const { logs } = await roomFactory.createRoom({
            from: roomOwner1,
            value: amount,
          });
          const event = await expectEvent.inLogs(logs, 'RoomCreated');

          const factoryBalance = await web3.eth.getBalance(roomFactory.address);
          const roomBalance = await web3.eth.getBalance(event.args._room);

          factoryBalance.should.be.bignumber.equal(0);
          roomBalance.should.be.bignumber.equal(amount);
        });

        it('should emit a RoomCreated event', async function () {
          const { logs } = await roomFactory.createRoom({
            from: roomOwner1,
            value: amount,
          });
          const event = await expectEvent.inLogs(logs, 'RoomCreated');

          event.args._creator.should.equal(roomOwner1);
          event.args._room.should.equal(event.args._room);
          event.args._depositedValue
            .toString()
            .should.be.bignumber.equal(amount);
        });

        it('can create multiple rooms', async function () {
          const { logs: logs1 } = await roomFactory.createRoom({
            from: roomOwner1,
            value: amount,
          });
          const { logs: logs2 } = await roomFactory.createRoom({
            from: roomOwner2,
            value: amount * 2,
          });
          const { logs: logs3 } = await roomFactory.createRoom({
            from: roomOwner3,
            value: 0,
          });

          const event1 = await expectEvent.inLogs(logs1, 'RoomCreated');
          const event2 = await expectEvent.inLogs(logs2, 'RoomCreated');
          const event3 = await expectEvent.inLogs(logs3, 'RoomCreated');

          const factoryBalance = await web3.eth.getBalance(roomFactory.address);
          const roomBalance1 = await web3.eth.getBalance(event1.args._room);
          const roomBalance2 = await web3.eth.getBalance(event2.args._room);
          const roomBalance3 = await web3.eth.getBalance(event3.args._room);

          factoryBalance.should.be.bignumber.equal(0);
          roomBalance1.should.be.bignumber.equal(amount);
          roomBalance2.should.be.bignumber.equal(amount * 2);
          roomBalance3.should.be.bignumber.equal(0);
        });

        it('can accept an empty deposit', async function () {
          const { logs } = await roomFactory.createRoom({
            from: roomOwner1,
            value: web3.utils.toWei('0', 'ether'),
          });
          const event = await expectEvent.inLogs(logs, 'RoomCreated');

          const factoryBalance = await web3.eth.getBalance(roomFactory.address);
          roomFactory = await web3.eth.getBalance(event.args._room);

          factoryBalance.should.be.bignumber.equal(0);
          roomFactory.should.be.bignumber.equal(0);
        });

        it('can pause createRoom', async function () {
          await roomFactory.pause();
          await roomFactory
            .createRoom({ from: roomOwner1, value: amount })
            .should.be.rejectedWith(EVMRevert);
        });

        it('only the factory owner can pause createRoom', async function () {
          await roomFactory
            .pause({ from: roomOwner1 })
            .should.be.rejectedWith(EVMRevert);
          await roomFactory.pause({ from: factoryOwner }).should.be.fulfilled;
        });

        it('only the factory owner can unpause createRoom', async function () {
          await roomFactory.pause({ from: factoryOwner });
          await roomFactory
            .createRoom({ from: roomOwner1, value: amount })
            .should.be.rejectedWith(EVMRevert);

          await roomFactory.unpause({ from: factoryOwner });
          await roomFactory.createRoom({ from: roomOwner1, value: amount })
            .should.be.fulfilled;
        });
      });
    });
  },
);
