const { EVMRevert, expectEvent } = require('@openzeppelin/test-helpers');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Room', ([roomOwner1, roomOwner2, roomOwner3, gest]) => {
  const Room = artifacts.require('Room');
  let room;

  describe('as an instance', () => {
    beforeEach(async function () {
      room = await Room.new(roomOwner1);
    });

    it('should exist', function () {
      room.should.exist;
    });

    it('should be a owner', async function () {
      const result = await room.owner.call();

      result.should.equal(roomOwner1);
    });

    describe('deposit', () => {
      const amount1 = web3.utils.toWei('1', 'ether');
      const amount2 = web3.utils.toWei('0', 'ether');
      const amount3 = web3.utils.toWei('-1', 'ether');

      it('should deposit value greater than to 0', async function () {
        await room.deposit({ from: roomOwner1, value: amount1 }).fulfilled;
        await room
          .deposit({ from: roomOwner2, value: amount2 })
          .should.be.rejectedWith(EVMRevert);
        await room
          .deposit({ from: roomOwner3, value: amount3 })
          .should.be.rejectedWith(EVMRevert);
      });

      it('should deposit', async function () {
        const { logs } = await room.deposit({
          from: roomOwner1,
          value: amount1,
        });
        const event = await expectEvent.inLogs(logs, 'Deposited');
        const OwnerBalance = event.args._depositedValue.toString();

        OwnerBalance.should.be.bignumber.equal(amount1);
      });

      it('should emit a Deposited event', async function () {
        const { logs } = await room.deposit({
          from: roomOwner1,
          value: amount1,
        });
        const event = await expectEvent.inLogs(logs, 'Deposited');

        event.args._depositor.should.equal(roomOwner1);
        event.args._depositedValue
          .toString()
          .should.be.bignumber.equal(amount1);
      });
    });

    describe('sendReward', async function () {
      const amount1 = web3.utils.toWei('2', 'ether');
      const amount2 = web3.utils.toWei('1', 'ether');
      const amount3 = web3.utils.toWei('0', 'ether');
      const amount4 = web3.utils.toWei('-1', 'ether');
      const id = 0;

      it('should emit a sendReward event', async function () {
        await room.deposit({ from: roomOwner1, value: amount1, gas: '30000' });
        const { logs } = await room.sendReward(amount2, gest, id);
        const event = await expectEvent.inLogs(logs, 'RewardSent');

        event.args._dest.should.equal(gest);
        event.args._reward.toString().should.be.bignumber.equal(amount2);
        event.args._id.toString().should.be.bignumber.equal(id);
      });

      it('should change rewardSent false to true', async function () {
        await room.deposit({ from: roomOwner1, value: amount1, gas: '30000' });
        let rewardSent = await room.rewardSent.call(id);
        rewardSent.should.equal(false);

        await room.sendReward(amount2, gest, id);
        rewardSent = await room.rewardSent.call(id);
        rewardSent.should.equal(true);
      });

      it('rewardSent must be false', async function () {
        await room.deposit({ from: roomOwner1, value: amount1, gas: '30000' });
        await room
          .sendReward(amount2, gest, id)
          .should.not.be.rejectedWith(EVMRevert);
        await room
          .sendReward(amount2, gest, id)
          .should.be.rejectedWith(EVMRevert);
      });

      it('reward must be greater than to 0', async function () {
        await room.deposit({ from: roomOwner1, value: amount1, gas: '30000' });
        await room
          .sendReward(amount3, gest, id)
          .should.be.rejectedWith(EVMRevert);
        await room
          .sendReward(amount4, gest, id)
          .should.be.rejectedWith(EVMRevert);
        await room
          .sendReward(amount2, gest, id)
          .should.not.be.rejectedWith(EVMRevert);
      });

      it('balance must be greater than to reward', async function () {
        await room.deposit({ from: roomOwner1, value: amount2, gas: '30000' });
        await room
          .sendReward(amount1, gest, id)
          .should.be.rejectedWith(EVMRevert);
        await room.deposit({ from: roomOwner1, value: amount2, gas: '30000' });
        await room
          .sendReward(amount1, gest, id)
          .should.not.be.rejectedWith(EVMRevert);
      });

      it('dest must be non-owner', async function () {
        await room.deposit({ from: roomOwner1, value: amount1, gas: '30000' });
        await room
          .sendReward(amount2, roomOwner1, id)
          .should.be.rejectedWith(EVMRevert);
        await room
          .sendReward(amount2, gest, id)
          .should.not.be.rejectedWith(EVMRevert);
      });
    });

    describe('refundToOwner', async function () {
      const amount1 = web3.utils.toWei('0', 'ether');
      const amount2 = web3.utils.toWei('1', 'ether');

      it('should emit a refundToOwner event', async function () {
        await room.deposit({ from: roomOwner1, value: amount2, gas: '30000' });
        const { logs } = await room.refundToOwner();
        const event = await expectEvent.inLogs(logs, 'RefundedToOwner');

        event.args._dest.should.equal(roomOwner1);
        event.args._refundedBalance
          .toString()
          .should.be.bignumber.equal(amount2);
      });

      it('should refund all balance to owner', async function () {
        const test1 = await web3.eth.getBalance(room.address);
        await room.deposit({ from: roomOwner1, value: amount2, gas: '30000' });
        const test2 = await web3.eth.getBalance(room.address);
        await room.refundToOwner();
        const test3 = await web3.eth.getBalance(room.address);

        test1.toString().should.equal(amount1);
        test2.toString().should.equal(amount2);
        test3.toString().should.equal(amount1);
      });

      it('balance must be greater than to 0', async function () {
        await room.refundToOwner().should.be.rejectedWith(EVMRevert);
        await room.deposit({ from: roomOwner2, value: amount2, gas: '30000' });
        const { logs } = await room.refundToOwner();
        const event = await expectEvent.inLogs(logs, 'RefundedToOwner');

        event.args._refundedBalance.toString().should.equal(amount2);
      });
    });
  });
});
