const { EVMRevert, expectEvent } = require('@openzeppelin/test-helpers');

require('chai').use(require('chai-as-promised')).should();

contract('Activatable', ([roomOwner1, roomOwner2]) => {
  const Activatable = artifacts.require('Activatable');
  let activatable;
  describe('as an instance', () => {
    beforeEach(async function () {
      activatable = await Activatable.new({ from: roomOwner1 });
    });

    it('should exist', function () {
      activatable.should.exist;
    });

    it('initial value of active must be false', async function () {
      const result = await activatable.active.call();

      result.should.equal(false);
    });

    describe('activate', () => {
      it('should emit a Activate event', async function () {
        const { logs } = await activatable.activate({ from: roomOwner1 });
        const event = await expectEvent.inLogs(logs, 'Activate');

        event.args._sender.should.equal(roomOwner1);
      });

      it('activate requires active to be true', async function () {
        await activatable.activate({ from: roomOwner1 });
        const result = await activatable.active.call();

        result.should.equal(true);
      });

      it('only owner can activate', async function () {
        await activatable
          .activate({ from: roomOwner2 })
          .should.be.rejectedWith(EVMRevert);
        await activatable.activate({ from: roomOwner1 }).should.be.fulfilled;
      });

      it('should be false when executing activate', async function () {
        await activatable.activate({ from: roomOwner1 }).should.be.fulfilled;
        await activatable
          .activate({ from: roomOwner1 })
          .should.be.rejectedWith(EVMRevert);
      });
    });

    describe('deactivate', () => {
      it('should emit a Deactivate event', async function () {
        await activatable.activate({ from: roomOwner1 });
        const { logs } = await activatable.deactivate({ from: roomOwner1 });
        const event = await expectEvent.inLogs(logs, 'Deactivate');

        event.args._sender.should.equal(roomOwner1);
      });

      it('deactivate requires active to be false', async function () {
        await activatable.activate({ from: roomOwner1 });
        await activatable.deactivate({ from: roomOwner1 });
        const result = await activatable.active.call();

        result.should.equal(false);
      });

      it('only owner can deactivate', async function () {
        await activatable.activate({ from: roomOwner1 });
        await activatable
          .deactivate({ from: roomOwner2 })
          .should.be.rejectedWith(EVMRevert);
        await activatable.deactivate({ from: roomOwner1 }).should.be.fulfilled;
      });

      it('should be true when executing deactivate', async function () {
        await activatable
          .deactivate({ from: roomOwner1 })
          .should.be.rejectedWith(EVMRevert);
        await activatable.activate({ from: roomOwner1 }).should.be.fulfilled;
        await activatable.deactivate({ from: roomOwner1 }).should.be.fulfilled;
      });
    });
  });
});
