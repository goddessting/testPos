var fixtures = require('../spec/spc/fixtures.js');

var printReceipt = (tags) => {
  var allItems = fixtures.loadAllItems();
  var promotions = fixtures.loadPromotions();

  var cartItems = buildCartItems(tags, allItems);
  var receiptItems = buildReceiptItems(cartItems, promotions);
  var receipt = buildReceipt(receiptItems);
  var print = buildPrint(receipt, promotions);

  console.log(print);
};

var buildCartItems = (tags, allItems) => {
    var cartItems = [];

    for (var tag of tags) {
        var splittedTag = tag.split('-');
        var barcode = splittedTag[0];
        var count = parseFloat(splittedTag[1] || 1);

        var cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

        if (cartItem) {
            cartItem.count += count;
        } else {
            var item = allItems.find(item => item.barcode === barcode);

            cartItems.push({item: item, count: count});
        }
    }

    return cartItems;
}

var buildReceiptItems = (cartItems, promotions) => {
  return cartItems.map(cartItem => {
    var promotionType = getPromotionType(cartItem.item.barcode, promotions);
    var a = discount(cartItem, promotionType);
    var receiptItem = {cartItem, subtotal: a[0], saved: a[1]};

    return {cartItem, subtotal: a[0], saved: a[1]}
  })
};

var getPromotionType = (barcode, promotions) => {
  var promotion = promotions.find(promotion => promotion.barcodes.find(tag => tag === barcode));

  return promotion ? promotion.type : '';
};

var discount = (cartItem, promotionType) => {
  var freeItemCount = 0;
  var saved = 0;
  var  subtotal = cartItem.count * cartItem.item.price;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
    saved = freeItemCount * cartItem.item.price;
  }
  else if(promotionType === 'A_95_PERCENT_CHARGE'){
    saved = parseFloat((0.05 * cartItem.item.price * cartItem.count).toFixed(2));
  }
 subtotal -= saved;

  return [subtotal, saved];
};

var buildReceipt = (receiptItems) => {
  var total = 0;
  var totalSaved = 0;

  for (var receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    totalSaved += receiptItem.saved;
  }

  return {receiptItem: receiptItems, total: total, totalSaved: totalSaved};
};

var buildPrint = (receipt, promotions) => {
  var receiptItems = receipt.receiptItem;
var  print = `***<没钱赚商店>收据***
`;
var total = 0;
var totalSaved = 0;

for (var receiptItem of receiptItems) {
  var name = receiptItem.cartItem.item.name;
  var count = receiptItem.cartItem.count;
  var unit = receiptItem.cartItem.item.unit;
  var price = receiptItem.cartItem.item.price.toFixed(2);
  var subtotal = receiptItem.subtotal.toFixed(2);
  var saved = receiptItem.saved.toFixed(2);

  var promotion = (promotions.find(promotion => promotion.barcodes.find(tag => tag === receiptItem.cartItem.item.barcode)) || 'undefined');
  var promotionType = promotion.type;

  var freeItem = `----------------------
买二赠一商品:
`;

  total += receiptItem.subtotal;
  totalSaved += receiptItem.saved;

  if(promotionType === 'A_95_PERCENT_CHARGE' && saved != '0.00'){
  print += `名称：${name}，数量：${count}${unit}，单价：${price}(元)，小计：${subtotal}(元),节省${saved}(元)
`;
}else{
print += `名称：${name}，数量：${count}${unit}，单价：${price}(元)，小计：${subtotal}(元)
`;}
  if(promotionType === 'BUY_TWO_GET_ONE_FREE' && saved != '0.00'){
    freeItem += `名称:${receiptItem.cartItem.item.name},数量:${receiptItem.cartItem.count}${receiptItem.cartItem.item.unit}
`;
  }
}
print += freeItem;
print += `----------------------
总计：${total.toFixed(2)}(元)
节省：${totalSaved.toFixed(2)}(元)
**********************`;

return print;
};

module.exports = {printReceipt: printReceipt,  buildCartItems: buildCartItems, buildReceiptItems:buildReceiptItems, buildReceipt: buildReceipt, buildPrint: buildPrint};
