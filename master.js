var ufs = '<option value="AC">AC</option><option value="AL">AL</option><option value="AM">AM</option><option value="AP">AP</option><option value="BA">BA</option><option value="CE">CE</option><option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option><option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option><option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option><option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option><option value="RJ">RJ</option><option value="RN">RN</option><option value="RO">RO</option><option value="RS">RS</option><option value="RR">RR</option><option value="SC">SC</option><option value="SE">SE</option><option value="SP">SP</option><option value="TO">TO</option>';

var ddds = {
    "AC": ["68"],
    "AL": ["82"],
    "AM": ["92", "97"],
    "AP": ["96"],
    "BA": ["71", "73", "74", "75", "77"],
    "CE": ["85", "88"],
    "DF": ["61"],
    "ES": ["27", "28"],
    "GO": ["62", "64"],
    "MA": ["98", "99"],
    "MG": ["31", "32", "33", "34", "35", "37", "38"],
    "MS": ["67"],
    "MT": ["65", "66"],
    "PA": ["91", "93", "94"],
    "PB": ["83"],
    "PE": ["81", "87"],
    "PI": ["86", "89"],
    "PR": ["41", "42", "43", "44", "45", "46"],
    "RJ": ["21", "22", "24"],
    "RN": ["84"],
    "RO": ["69"],
    "RR": ["95"],
    "RS": ["51", "53", "54", "55"],
    "SC": ["47", "48", "49"],
    "SE": ["79"],
    "SP": ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
    "TO": ["63"]
}

$(document).on('change', '.escolha-estado', function(event) {
  event.preventDefault();
  var uf = $(this).val();

  if (ddds[uf].length > 0) {
    var select_ddd = $(".escolha-ddd");
    select_ddd.find("option").first().text("DDD");
        select_ddd.find('option').not(':first').remove();
    for (var i = 0; i < ddds[uf].length; i++) {
      select_ddd.append('<option value="'+ddds[uf][i]+'">'+ddds[uf][i]+'</option>');
    }
  }

});

$(document).on('change', '.escolha-ddd', function(event) {
  event.preventDefault();
});

function checa_cookie_ddd(){
  if( _GETURL("uf") ){
    $(".modal-ddd").css('display', 'none');
    $(".place-uf").html(_GETURL("uf").toUpperCase());
    get_precos(ddds[_GETURL("uf").toUpperCase()][0], _GETURL("uf").toUpperCase(), null);
    return true;
  }else{

    if (readCookie('ddd') && readCookie('uf')) {
      $(".modal-ddd").css('display', 'none');
      $(".place-uf").html(readCookie('uf'));
      get_precos(readCookie('ddd'), readCookie('uf'), null);
      return true;
    }else{
      $(".modal-ddd").css('display', 'block');
      return false;
    }
  }
}

function trata_preco_api(valor){
  var valores = valor.toString().split(".");
  return [valores[0], valores[1]];
}
