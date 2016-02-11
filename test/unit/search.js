import aggregation from '../../src/aggregation';
import Base from '../../src/base';
import AppendScript from '../../src/append_script';
import JsonP from '../../src/jsonp';
import Requester from '../../src/requester';
import Search from '../../src/search';

describe('Search', () => {
  class Foo extends aggregation(Base, AppendScript, JsonP, Requester, Search) {}
  let fooInstance;
  const CEP = '13324451';

  describe('eventHandler function', () => {
    beforeEach(() => {
      fooInstance = new Foo();
      spy(fooInstance, 'search');
    });

    it('should have been run search function once', () => {
      fooInstance.cepEl.value = CEP;

      let event = new CustomEvent('change');
      fooInstance.cepEl.dispatchEvent(event);

      expect(fooInstance.cep).to.eql(CEP);
      expect(fooInstance.search).to.have.been.calledOnce;
    });
  });

  describe('search function', () => {
    describe('when success', () => {
      describe('with callbacks', () => {
        let successCallback;
        let errorCallback;

        it('success callback has been called', (done) => {
          successCallback = ((data) => {
            done();

            expect(data).to.include.keys('cep');
            expect(data.cep).to.equal(CEP);

            expect(data).to.include.keys('tipoDeLogradouro');
            expect(data.tipoDeLogradouro).to.equal('Rua');

            expect(data).to.include.keys('logradouro');
            expect(data.logradouro).to.equal('Estado de São Paulo');

            expect(data).to.include.keys('bairro');
            expect(data.bairro).to.equal('Loteamento Terras de São Pedro e São Paulo');

            expect(data).to.include.keys('cidade');
            expect(data.cidade).to.equal('Salto');

            expect(data).to.include.keys('estado');
            expect(data.estado).to.equal('SP');
          });

          let fooInstance = new Foo({ success: successCallback, error: errorCallback });
          fooInstance.cep = CEP;
          fooInstance.search();
        });

        it('error callback has been called', (done) => {
          errorCallback = ((data) => {
            done();
            expect(true).to.be.true;
          });

          let fooInstance = new Foo({ success: successCallback, error: errorCallback });
          fooInstance.cep = '00000000';
          fooInstance.search();
        });

        it('event:success has been triggered', (done) => {
          document.addEventListener('foo:success', ((data) => {
            done();

            expect(data.detail).to.include.keys('cep');
            expect(data.detail.cep).to.equal(CEP);

            expect(data.detail).to.include.keys('tipoDeLogradouro');
            expect(data.detail.tipoDeLogradouro).to.equal('Rua');

            expect(data.detail).to.include.keys('logradouro');
            expect(data.detail.logradouro).to.equal('Estado de São Paulo');

            expect(data.detail).to.include.keys('bairro');
            expect(data.detail.bairro).to.equal('Loteamento Terras de São Pedro e São Paulo');

            expect(data.detail).to.include.keys('cidade');
            expect(data.detail.cidade).to.equal('Salto');

            expect(data.detail).to.include.keys('estado');
            expect(data.detail.estado).to.equal('SP');

            expect(data.type).to.equal('foo:success');
          }), false);

          let fooInstance = new Foo({ triggerEventName: 'foo' });
          fooInstance.cep = CEP;
          fooInstance.search();
        });

        it('event:error has been triggered', (done) => {
          document.addEventListener('foo:error', ((data) => {
            done();

            expect(data.type).to.equal('foo:error');
          }), false);

          let fooInstance = new Foo({ triggerEventName: 'foo' });
          fooInstance.cep = '00000000';
          fooInstance.search();
        });

        it('when success has been fill form', () => {
          let fooInstance = new Foo();

          fooInstance.fillForm({ tipoDeLogradouro: 'Rua', logradouro: 'logradouro', bairro: 'bairro', cidade: 'cidade', estado: 'estado' });

          expect(fooInstance.streetEl.value).to.equal('Rua logradouro');
          expect(fooInstance.neighborhoodEl.value).to.equal('bairro');
          expect(fooInstance.cityEl.value).to.equal('cidade');
          expect(fooInstance.stateEl.value).to.equal('estado');
        });
      });
    });
  });
});
