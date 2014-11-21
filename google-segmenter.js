$(document).ready(function() {

    // sendボタンが押されたら実行
    $("#send").click(function(){
        query = $("#query").val();
        getResults(query);
    });

    // 検索結果取得して単語の出現頻度を出力 
    function getResults(query){
        // API叩いてGoogle検索結果取得
        $.getJSON("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&rsz=8&callback=?&q="+query, function(data) {
            results = data.responseData.results;
            printSegmentationResults(results);
        });
    }

    // 検索結果のタイトルを表示
    function printTitles(results){
        $("#results").html("");
        for (var i = 0; i < results.length; i++) {
            $("#results").append(results[i].titleNoFormatting + "<br>");
        };        
    }

    // 形態素解析して結果を配列で返す．簡単な前処理も行う．
    function segment(text){
        // <b> </b>を削除
        text = text.replace(/<\/*b>/g,"");
        var segmenter = new TinySegmenter();
        var segs = segmenter.segment(text);
        
        // ストップワードの除去
        for (var i = 0; i < segs.length; i++) {
            if(segs[i].match(/これ|それ|あれ|この|その|あの|ここ|そこ|あそこ|こちら|どこ|だれ|なに|なん|何|私|貴方|貴方方|我々|私達|あの人|あのかた|彼女|彼|です|あります|おります|います|は|が|の|に|を|で|え|から|まで|より|も|どの|と|し|それで|しかし|\.\.\.|\s|。|、|「|」|『|』|（|）|,|\.|＠|@|・|\/|\(|\)/ig)){
                segs.splice(i, 1);
                i--;
            }
        };        
        return segs;
    }

    // 形態素解析した結果を表示
    function printSegmentationResults(results){
        $("#results").html("<h1>形態素解析結果</h1>");
        var counts = new Object();
        for (var i = 0; i < results.length; i++) {
            text = results[i].titleNoFormatting + " " + results[i].content;
            segs = segment(text);
            for(var j = 0; j < segs.length; j++) {
                if(counts[segs[j]]) {
                    counts[segs[j]]++;
                }else{
                    counts[segs[j]]=1;
                }
            }
            $("#results").append(
                "<h3>"+results[i].titleNoFormatting+"</h3><ul><li>"+ results[i].content + "</li><li>"+segment(text).join("｜") + "</li></ul>"
                );
        };

        $("#counts").html("");
        $("#counts").append('<h1>counts</h1><table border="1">');
        for (var key in counts) {
            $("#counts").append("<tr><td>"+ key + "</td><td>"+ counts[key] + "</td></tr>");
        }       
        $("#counts").append("</table><hr>");
        console.log(counts);
    }

});