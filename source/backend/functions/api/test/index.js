const {assert} = require('chai');
const rewire = require('rewire');
const index = rewire('../src/index');
const sinon = require('sinon');

describe('index.js', () => {

    describe('getLinkedNodes', () => {

        const getLinkedNodes = index.__get__('getLinkedNodes');

        const mockGCommon = {
            has: sinon.stub().returnsThis(),
            dedup: sinon.stub().returnsThis(),
            elementMap: sinon.stub().returnsThis(),
            repeat: sinon.stub().returnsThis(),
            times: sinon.stub().returnsThis(),
            V: sinon.stub().returnsThis()
        };

        it('should get node linked to resource with id', async () => {
            const mockG = {
                ...mockGCommon,
                toList: sinon.stub().resolves([
                    {id: '1', label: 'test_label1', perspectiveBirthDate: 'date1', a: 1, b: '2'},
                    {id: '2', label: 'test_label2', perspectiveBirthDate: 'date2', c: 3, d: '4'},
                    {id: '3', label: 'test_label3', perspectiveBirthDate: 'date3', e: 5, f: '6'}
                ]),
                next: sinon.stub().resolves({
                    value: {id: '4', label: 'test_label4', perspectiveBirthDate: 'date4', g: 1, h: '2'}
                })
            }

            const expected = [
                {id: '1', label: 'test::label1', perspectiveBirthDate: 'date1', parent: false, properties: {a: 1, b: '2'}},
                {id: '2', label: 'test::label2', perspectiveBirthDate: 'date2', parent: false, properties: {c: 3, d: '4'}},
                {id: '3', label: 'test::label3', perspectiveBirthDate: 'date3', parent: false, properties: {e: 5, f: '6'}},
                {id: '4', label: 'test::label4', perspectiveBirthDate: 'date4', parent: true, properties: {g: 1, h: '2'}}
            ]

            const actual = await getLinkedNodes(mockG, '4');
            assert.deepEqual(actual, expected);
        });

        it('should get deleted nodes when given a date', async () => {
            const toListStub = sinon.stub();

            toListStub.onFirstCall().resolves([
                {id: '1', label: 'test_label1', perspectiveBirthDate: 'dateTest1', a: 1, b: '2'},
                {id: '2', label: 'test_label2', perspectiveBirthDate: 'dateTest2', c: 3, d: '4'},
            ]);
            toListStub.onSecondCall().resolves([
                {id: '3', label: 'test_label3', perspectiveBirthDate: 'dateTest3', e: 5, f: '6'}
            ]);

            const mockG = {
                ...mockGCommon,
                toList: toListStub,
                next: sinon.stub().resolves({
                    value: {id: '4', label: 'test_label4', perspectiveBirthDate: 'dateTest4', g: 1, h: '2'}
                })
            }

            const expected = [
                {id: '1', label: 'test::label1', perspectiveBirthDate: 'dateTest1', parent: false, properties: {a: 1, b: '2'}},
                {id: '2', label: 'test::label2', perspectiveBirthDate: 'dateTest2', parent: false, properties: {c: 3, d: '4'}},
                {id: '3', label: 'test::label3', perspectiveBirthDate: 'dateTest3', parent: false, properties: {e: 5, f: '6'}},
                {id: '4', label: 'test::label4', perspectiveBirthDate: 'dateTest4', parent: true, properties: {g: 1, h: '2'}}
            ]

            const actual = await getLinkedNodes(mockG, '4', '2021-06-18T12:24:25Z');
            assert.deepEqual(actual, expected);
        });

    });

});