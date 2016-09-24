var checkDateNum = function (obj) {
    var val = $.trim($(obj).val()),
        re = /[^0-9]/,
        d = null;
    val = $.trim(val.replace(re, ''));
    if (val.length != 4) {
        $(obj).val('');
    }
    d = parseFloat(val.substr(0, 2));
    if ((d < 18) || (d > 20)) {
        $(obj).val('');
    }
    d = new Date();
    var y = d.getFullYear();
    if (val > y) {
        $(obj).val('');
    }
    return val;
};
var pad_with_zeros = function (rounded_value, decimal_places) {
    var value_string = rounded_value.toString(),
        decimal_location = value_string.indexOf("."),
        decimal_part_length = 0;
    if (decimal_location == -1) {
        value_string += decimal_places > 0 ? "." : "";
    }
    else {
        decimal_part_length = value_string.length - decimal_location - 1
    }
    var pad_total = decimal_places - decimal_part_length;
    if (pad_total > 0) {
        for (var counter = 1; counter <= pad_total; counter++)
            value_string += "0"
    }
    return value_string;
};
var number_format = function (number, decimals, dec_point, thousands_sep) {
    var n = number, prec = decimals;
    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return (Math.round(n * k) / k).toString();
    };
    n = !isFinite(+n) ? 0 : +n;
    prec = !isFinite(+prec) ? 0 : Math.abs(prec);
    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
    var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec);
    var abs = toFixedFix(Math.abs(n), prec);
    var _, i;
    if (abs >= 1000) {
        _ = abs.split(/\D/);
        i = _[0].length % 3 || 3;
        _[0] = s.slice(0, i + (n < 0)) +
            _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
        s = _.join(dec);
    } else {
        s = s.replace('.', dec);
    }
    var decPos = s.indexOf(dec);
    if (prec >= 1 && decPos !== -1 && (s.length - decPos - 1) < prec) {
        s += new Array(prec - (s.length - decPos - 1)).join(0) + '0';
    }
    else if (prec >= 1 && decPos === -1) {
        s += dec + new Array(prec).join(0) + '0';
    }
    return s;
};
var formatNumber = function (num, decimal_places, min_val, max_val) {
    decimal_places = (!decimal_places) ? 0 : Math.abs(decimal_places);
    var default_val = (min_val !== null) ? min_val : 0;
    var thisNum = parseFloat(num);
    if ((min_val !== null) && (thisNum < min_val)) {
        thisNum = min_val
    }
    if ((max_val !== null) && (thisNum > max_val)) {
        thisNum = max_val
    }
    if (decimal_places == 0) {
        thisNum = parseInt(thisNum);
    } else {
        t1 = (isNaN(thisNum)) ? default_val : thisNum;
        t2 = round_decimals(t1, decimal_places);
        t3 = pad_with_zeros(t2, decimal_places);
        thisNum = t3;
    }
    return (isNaN(thisNum)) ? ((decimal_places == 0) ? default_val : pad_with_zeros(default_val, decimal_places)) : thisNum;
};
var removeFormatMoney = function (obj) {
    var re = /[^0-9\-\.]/g,
        val = $(obj).val();
    $(obj).val(val.replace(re, ''));
};
var checkFormatMoney = function (obj) {
    var val = $(obj).val(),
        re = /(m)/gi,
        re1 = /(t)/gi,
        re2 = /[^0-9\-\.]/g;
    if (val.match(re)) {
        $(obj).val(parseFloat(val.replace(re2, '')) * 1000000);
    } else if (val.match(re1)) {
        $(obj).val(parseFloat(val.replace(re2, '')) * 1000);
    }
    removeFormatMoney(obj)
};
var formatMoney = function (obj, decimal_places, currency_symbol) {
    checkFormatMoney(obj);
    var num = parseFloat(formatNumber(obj.value, decimal_places));
    if (!currency_symbol) currency_symbol = "";
    $(obj).val(currency_symbol + number_format(num, decimal_places));
};
var updateSummary = function (response) {
    if (!$.isEmptyObject(response)) {
        var list = $('<ul>');
        $.each(response, function () {
            list.append($('<li>').append(this));
        });
        $('.error-summary').html(list);
        $('.error-summary-block').toggle();
        return false;
    } else {
        $('.error-summary-block').hide();
    }
    return true;
};
String.prototype.toCapitals = function () {
    var i, str, lowers, uppers;
    str = this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
    return str.toString();
};
$(document).ready(function () {
    $('form#step1-form, form#step2-form').on('beforeValidate', function (e) {
        var form = $(this),
            error = false;
        if (form.find('.has-error').length) {
            return false;
        }
        $.ajax({
            url: form.attr('action'),
            type: 'post',
            data: form.serialize(),
            success: function (response) {
                if ($.isEmptyObject(response)) {
                    form.yiiActiveForm('validate');
                } else {
                    error = updateSummary(response);
                }
            }
        });
        return error;
    });

    $(document).on('beforeValidate', 'form#est-update-form', function (e) {
        var form = $(this),
            error = false;
        $.ajax({
            url: form.attr('action'),
            type: 'post',
            data: form.serialize(),
            success: function (response) {
                if ($.isEmptyObject(response)) {
                    form.yiiActiveForm('validate');
                } else {
                    error = updateSummary(response);
                }
            }
        });
        // return error;
    });

    $('#company-name, #customer-firstname, #customer-lastname, #contactform-firstname, #contactform-lastname').on('change', function () {
        var $this = $(this);
        $this.val($.trim($this.val().toCapitals()));
    });
    $('#company-zip').on('change', function () {
        var $this = $(this);
        if (!$.isNumeric($this.val()))
            $this.css('color', 'red');
    });
    $('div.faq-issue').on('click', function () {
        $(this).next().fadeToggle(200, 'linear');
    });
    
    
});


function calcStepOne(){
    console.log('ok');
    var sector = $('#company-sector').val();
    var year = $('#company-established').val();
    
    if(sector !== '' && year !== '')
        window.location.href = 'calculator/' + year + '/' + sector;
}

var app = angular.module("calc", []); 
app.controller("mainCtrl", function($scope, $http) {
    
    var url = window.location.pathname.split('/');

    //$scope.number = '123,245,245';
    $scope.stepClass = 'step1';
    $scope.step = '1';
    $scope.sectors = window.sectors;
    $scope.reasons = window.reasons;
    $scope.countries = window.countries;
    $scope.form = {
        sector: url[3],
        established: url[2],
        newsletter: true,
        form: ''
    };
    
    console.log(window.sectors);
    console.log(window.reasons);
    
    $scope.change = function(){
        console.log($scope.form);
    };
    
    var blackList = ['gmail.com','mail.com','yahoo.com','msn.com','aol.com','outlook.com','me.com','yandex.com','inbox.com'];
    function checkEmails(email){
        
        var flag = true;
        
        blackList.forEach(function(item){
            if(email.search(item) > -1) flag = false;
        })
        
        return flag;
    }
    
    $scope.save = function(){
        
        
        
        if($scope.step === '1'){
                    
            $scope.stepClass = 'step2';
            $scope.step = '2';
            
            $http.post('/api/calculator', $scope.form).then(function (response) {
                $scope.form._id = response.data._id;
              }, function (response) {
                console.log('error');
              });  
            
        } else{
            
            var validEmail = checkEmails($scope.form.email);
        
            if(!validEmail){
                $scope.emailError = true;
                return;
            }
            
            $scope.sending = 'Processing...';
            $http.post('/api/calculator', $scope.form).then(function (response) {
                $scope.number = response.data.number;
                $scope.stepClass = 'step3';
                $scope.step = '3';
                
              }, function (response) {
                console.log('error');
              });  
            
        }
        
    };
    
    $scope.back = function(){
        
        $scope.stepClass = 'step1';
        $scope.step = '1';
        
    };
});

var login = angular.module("login", []); 
login.controller("mainCtrl", function($scope, $http) {
    
    $scope.commas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    $scope.valuations = [];
    $scope.titleText = 'Login';
    
    $scope.send = function(code){
        $scope.code = code;
        $scope.sending = 'Fetching...';
        
        $http.get('/api/calculator/login/' + code).then(function (response) {
                $scope.valuations = response.data;
                $scope.titleText = 'Valuations';
                
              }, function (response) {
                $scope.sending = undefined;
              });  
    };
    
    $scope.getPdf = function(company){
                
        $http.post('/api/calculator/pdf/' + $scope.code, company ).then(function (response) {
                console.log('ok');
                
              }, function (response) {
                $scope.sending = undefined;
              });  
    };
    
});