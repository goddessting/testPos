'use strict';
var test = require('../../src/main.js');

describe('pos', () => {
    let inputs;

beforeEach(() => {
    inputs = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];
});

describe('text tags', () => {

    var allItems = [
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        }];

it('when tags has no count, the count should be 1', () => {

    var tag = ['ITEM000001'];
var cartItem = test.buildCartItems(tag, allItems);
var expectItem =
    [{
        item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        count: 1
    }
    ];

expect(cartItem).toEqual(expectItem);
});

it('when tags has 2 tags, the count should be 2', () => {

    var tags = ['ITEM000001', 'ITEM000001'];
var cartItem = test.buildCartItems(tags, allItems);
var expectItem =
    [{
        item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        count: 2
    }
    ];

expect(cartItem).toEqual(expectItem);
});

it('when count is 1.3 , the count should be 1.3', () => {

    var tag = ['ITEM000002-1.3'];
var cartItem = test.buildCartItems(tag, allItems);
var expectItems = [
    {
        item: {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        count: 1.3
    }
];

expect(cartItem).toEqual(expectItems);
});

it('when count is 3 , the count should be 3', () => {

    var tag = ['ITEM000002-3'];
var cartItem = test.buildCartItems(tag, allItems);
var expectItems = [
    {
        item: {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        count: 3
    }
];

expect(cartItem).toEqual(expectItems);
});

it('when count is 3+3 , the count should be 6', () => {

    var tag = ['ITEM000002-3', 'ITEM000002-3'];
var cartItem = test.buildCartItems(tag, allItems);
var expectItems = [
    {
        item: {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        count: 6
    }
];

expect(cartItem).toEqual(expectItems);
});
});

describe('receiptItems', () => {
    let promotions;

beforeEach(() => {
    promotions = [
    {
        type: 'BUY_TWO_GET_ONE_FREE',
        barcodes: [
            'ITEM000000',
            'ITEM000001',
            'ITEM000005'
        ]
    }
];
});

it('when cartItems can discount', () => {
    let cartItems = [{
        item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        count: 2
    }];

let receiptItems = test.buildReceiptItems(cartItems, promotions);
let expectReceiptItems = [{
    cartItem: {
        item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        count: 2
    },
    subtotal: 6.00,
    saved: 0.00
}];

expect(receiptItems).toEqual(expectReceiptItems);
});

it('when cartItems no discount', () => {
    let cartItems = [
        {
            item: {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            count: 3
        }];

let receiptItems = test.buildReceiptItems(cartItems, promotions);

let expectReceiptItems = [
    {
        cartItem: {
            item: {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            count: 3
        },
        subtotal: 16.5,
        saved: 0.00
    }];

expect(receiptItems).toEqual(expectReceiptItems);
});
});

it('the total should be 11', () => {
    let receiptItems = [{
      cartItem: {
        item: {
          barcode: 'ITEM000002',
          name: '苹果',
          unit: '斤',
          price: 5.50
        },
        count: 3
      },
      subtotal: 16.5,
      saved: 0.00
    },
      {
        cartItem: {
          item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count: 2
        },
        subtotal: 6.00,
        saved: 0.00
      }];

    let expectReceipt = {
      receiptItem: [
        {
          cartItem: {
            item: {
              barcode: 'ITEM000002',
              name: '苹果',
              unit: '斤',
              price: 5.50
            },
            count: 3
          },
          subtotal: 16.5,
          saved: 0.00
        },
        {
          cartItem: {
            item: {
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
            },
            count: 2
          },
          subtotal: 6.00,
          saved: 0.00
        }],
      total: 22.5,
      totalSaved: 0.00
    };
    let receipt = test.buildReceipt(receiptItems);

    expect(receipt).toEqual(expectReceipt);
  });

it('should print correct text', () => {

    spyOn(console, 'log');

test.printReceipt(inputs);

const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

expect(console.log).toHaveBeenCalledWith(expectText);
});
});
