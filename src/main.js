'use strict';

let buildCartItems = (tags, allItems) => {
    let cartItems = [];

    for (let tag of tags) {
        let splittedTag = tag.split('-');
        let barcode = splittedTag[0];
        let count = parseFloat(splittedTag[1] || 1);

        let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

        if (cartItem) {
            cartItem.count += count;
        } else {
            let item = allItems.find(item => item.barcode === barcode);

            cartItems.push({item: item, count: count});
        }
    }

    return cartItems;
}

let buildReceiptItems = (cartItems, promotions) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let a = discount(cartItem, promotionType);
    return {cartItem, subtotal: a[0], saved:a[1]}
  })
};

let getPromotionType = (barcode, promotions) => {

  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';
};

let discount = (cartItem, getPromotionType) => {
  let freeItemCount = 0;
  if (getPromotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }

  let saved = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.count * cartItem.item.price - saved;

  return [subtotal, saved];
};

let buildReceipt = (receiptItems) => {
  let total = 0;
  let totalSaved = 0;

  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    totalSaved += receiptItem.saved;
  }

  return {receiptItem: receiptItems, total: total, totalSaved: totalSaved};
};

let buildPrint = (receipt) => {
  let receiptItems = receipt.receiptItem;
  let print = `***<没钱赚商店>收据***
`;
  let total = 0;
  let totalSaved = 0;

  for (let receiptItem of receiptItems) {
    print += `名称：${receiptItem.cartItem.item.name}，数量：${receiptItem.cartItem.count}${receiptItem.cartItem.item.unit}，单价：${receiptItem.cartItem.item.price.toFixed(2)}(元)，小计：${receiptItem.subtotal.toFixed(2)}(元)
`;
    total += receiptItem.subtotal;
    totalSaved += receiptItem.saved;
  }
  print += `----------------------
总计：${total.toFixed(2)}(元)
节省：${totalSaved.toFixed(2)}(元)
**********************`;

  return print;
};

let printReceipt = (tags) => {
  let allItems = loadAllItems();
  let promotions = loadPromotions();

  let cartItems = buildCartItems(tags, allItems);
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receipt = buildReceipt(receiptItems);
  let print = buildPrint(receipt);
  console.log(print);
};

module.exports = {printReceipt: printReceipt, loadAllItems: loadAllItems, loadPromotions: loadPromotions, buildCartItems: buildCartItems, buildReceiptItems:buildReceiptItems, buildReceipt: buildReceipt, buildPrint: buildPrint};
