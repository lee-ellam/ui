describe('global.js', function() {
  describe('#addNumbers()', function() {
    var addNumbers = window.jg.chrome.addNumbers;
    it('should exist', function() {
      expect(typeof addNumbers).toEqual('function');
    });

    it('should return 0 if no parameters passed', function() {
      expect(addNumbers()).toEqual(0);
    });

    it('should sum any numbers passed', function() {
      expect(addNumbers(1, 2, 3)).toEqual(6);
    });

    it('should ignore any non-numbers passed', function() {
      expect(addNumbers(1, 2, {}, '', 3)).toEqual(6);
    });
  });
});