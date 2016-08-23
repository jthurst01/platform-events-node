var express = require('express');
var router = express.Router();

var Promise = require("bluebird");

var nforce = require('nforce');
var org = require('../lib/connection');

const util = require('util');

/* home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

/* Creates a new the record */
router.post('/', function(req, res, next) {
 
  var pie = nforce.createSObject('Printer_Ink_Level__e');
  pie.set('CustomerId__c', req.body.customerId);
  pie.set('Printer_Model__c', req.body.printerModel);
  pie.set('Printer_Ink_Level__c', req.body.printerInkLevel);

  console.log('req.body.customerId = ' + req.body.customerId);
  console.log('req.body.printerModel = ' + req.body.printerModel);
  console.log('req.body.printerInkLevel = ' + req.body.printerInkLevel);
  
  console.log(util.inspect(pie, { showHidden: true, depth: null }));
  
  org.insert({ sobject: pie })
    .then(
      res.redirect('/')
    )
});


/* Record detail page */
//router.get('/:id', function(req, res, next) {
  // query for record, contacts and opportunities
//  Promise.join(
//    org.getRecord({ type: 'account', id: req.params.id }),
//    org.query({ query: "Select Id, Name, Email, Title, Phone From Contact where AccountId = '" + req.params.id + "'"}),/
//    org.query({ query: "Select Id, Name, StageName, Amount, Probability From Opportunity where AccountId = '" + req.params.id + "'"}),
//    function(account, contacts, opportunities) {
//        res.render('show', { record: account, contacts: contacts.records, opps: opportunities.records });
//    });
//});

/* Display record update form */
//router.get('/:id/edit', function(req, res, next) {
//  org.getRecord({ id: req.params.id, type: 'Account'})
//    .then(function(account){
//      res.render('edit', { record: account });
//    });
//});

/* Display record update form */
//router.get('/:id/delete', function(req, res, next) {

//  var acc = nforce.createSObject('Account');
//  acc.set('Id', req.params.id);
//
//  org.delete({ sobject: acc })
//    .then(function(account){
//      res.redirect('/');
//    });
//});

/* Updates the record */
//router.post('/:id', function(req, res, next) {
//
//  var acc = nforce.createSObject('Account');
//  acc.set('Id', req.params.id);
//  acc.set('Name', req.body.name);
//  acc.set('Industry', req.body.industry);
//  acc.set('Type', req.body.type);
//  acc.set('AccountNumber', req.body.accountNumber);
//  acc.set('Description', req.body.description);

//  org.update({ sobject: acc })
//    .then(function(){
//      res.redirect('/' + req.params.id);
//    })
//});

module.exports = router;
