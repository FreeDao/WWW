(function(a,b){function m(a,b,c){var d=h[b.type]||{},e=b.empty||c;return e&&a==null?null:b.def&&a==null?b.def:(d.floor?a=~~a:a=parseFloat(a),a==null||isNaN(a)?b.def:d.mod?(a%=d.mod,a<0?d.mod+a:a):d.min>a?d.min:d.max<a?d.max:a)}function n(a,b,c){return c=(c+1)%1,c*6<1?a+(b-a)*6*c:c*2<1?b:c*3<2?a+(b-a)*(2/3-c)*6:a}var c="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color outlineColor".split(" "),d=/^([\-+])=\s*(\d+\.?\d*)/,e=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(a){return[a[1],a[2],a[3],a[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(a){return[2.55*a[1],2.55*a[2],2.55*a[3],a[4]]}},{re:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(a){return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]}},{re:/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,parse:function(a){return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(a){return[a[1],a[2]/100,a[3]/100,a[4]]}}],f=a.Color=function(b,c,d,e){return new a.Color.fn.parse(b,c,d,e)},g={rgba:{cache:"_rgba",props:{red:{idx:0,type:"byte",empty:!0},green:{idx:1,type:"byte",empty:!0},blue:{idx:2,type:"byte",empty:!0},alpha:{idx:3,type:"percent",def:1}}},hsla:{cache:"_hsla",props:{hue:{idx:0,type:"degrees",empty:!0},saturation:{idx:1,type:"percent",empty:!0},lightness:{idx:2,type:"percent",empty:!0}}}},h={"byte":{floor:!0,min:0,max:255},percent:{min:0,max:1},degrees:{mod:360,floor:!0}},i=g.rgba.props,j=f.support={},k,l=a.each;g.hsla.props.alpha=i.alpha,f.fn=f.prototype={constructor:f,parse:function(c,d,h,j){if(c===b)return this._rgba=[null,null,null,null],this;if(c instanceof a||c.nodeType)c=c instanceof a?c.css(d):a(c).css(d),d=b;var n=this,o=a.type(c),p=this._rgba=[],q;d!==b&&(c=[c,d,h,j],o="array");if(o==="string")return c=c.toLowerCase(),l(e,function(a,b){var d=b.re.exec(c),e=d&&b.parse(d),f,h=b.space||"rgba",i=g[h].cache;if(e)return f=n[h](e),n[i]=f[i],p=n._rgba=f._rgba,!1}),p.length!==0?(Math.max.apply(Math,p)===0&&a.extend(p,k.transparent),this):(c=k[c]||k._default,this.parse(c));if(o==="array")return l(i,function(a,b){p[b.idx]=m(c[b.idx],b)}),this;if(o==="object")return c instanceof f?l(g,function(a,b){c[b.cache]&&(n[b.cache]=c[b.cache].slice())}):l(g,function(a,b){l(b.props,function(a,d){var e=b.cache;if(!n[e]&&b.to){if(c[a]==null||a==="alpha")return;n[e]=b.to(n._rgba)}n[e][d.idx]=m(c[a],d,!0)})}),this},is:function(a){var b=f(a),c=!0,d=this;return l(g,function(a,e){var f=b[e.cache],g;return f&&(g=d[e.cache]||e.to&&e.to(d._rgba)||[],l(e.props,function(a,b){if(f[b.idx]!=null)return c=f[b.idx]==g[b.idx],c})),c}),c},_space:function(){var a=[],b=this;return l(g,function(c,d){b[d.cache]&&a.push(c)}),a.pop()},transition:function(a,b){var c=f(a),d=c._space(),e=g[d],i=this[e.cache]||e.to(this._rgba),j=i.slice();return c=c[e.cache],l(e.props,function(a,d){var e=d.idx,f=i[e],g=c[e],k=h[d.type]||{};if(g===null)return;f===null?j[e]=g:(k.mod&&(g-f>k.mod/2?f+=k.mod:f-g>k.mod/2&&(f-=k.mod)),j[d.idx]=m((g-f)*b+f,d))}),this[d](j)},blend:function(b){if(this._rgba[3]===1)return this;var c=this._rgba.slice(),d=c.pop(),e=f(b)._rgba;return f(a.map(c,function(a,b){return(1-d)*e[b]+d*a}))},toRgbaString:function(){var b="rgba(",c=a.map(this._rgba,function(a,b){return a==null?b>2?1:0:a});return c[3]===1&&(c.pop(),b="rgb("),b+c.join(",")+")"},toHslaString:function(){var b="hsla(",c=a.map(this.hsla(),function(a,b){return a==null&&(a=b>2?1:0),b&&b<3&&(a=Math.round(a*100)+"%"),a});return c[3]==1&&(c.pop(),b="hsl("),b+c.join(",")+")"},toHexString:function(b){var c=this._rgba.slice(),d=c.pop();return b&&c.push(~~(d*255)),"#"+a.map(c,function(a,b){return a=(a||0).toString(16),a.length==1?"0"+a:a}).join("")},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString()}},f.fn.parse.prototype=f.fn,g.hsla.to=function(a){if(a[0]==null||a[1]==null||a[2]==null)return[null,null,null,a[3]];var b=a[0]/255,c=a[1]/255,d=a[2]/255,e=a[3],f=Math.max(b,c,d),g=Math.min(b,c,d),h=f-g,i=f+g,j=i*.5,k,l;return g===f?k=0:b===f?k=60*(c-d)/h+360:c===f?k=60*(d-b)/h+120:k=60*(b-c)/h+240,j===0||j===1?l=j:j>.5?l=h/(2-i):l=h/i,[Math.round(k)%360,l,j,e==null?1:e]},g.hsla.from=function(a){if(a[0]==null||a[1]==null||a[2]==null)return[null,null,null,a[3]];var b=a[0]/360,c=a[1],d=a[2],e=a[3],f=d>.5?d+c-d*c:d*(1+c),g=2*d-f,h,i,j;return[Math.round(n(g,f,b+1/3)*255),Math.round(n(g,f,b)*255),Math.round(n(g,f,b-1/3)*255),e]},l(g,function(c,e){var g=e.props,h=e.cache,i=e.to,j=e.from;f.fn[c]=function(c){i&&!this[h]&&(this[h]=i(this._rgba));if(c===b)return this[h].slice();var d=a.type(c),e=d==="array"||d==="object"?c:arguments,k=this[h].slice(),n;return l(g,function(a,b){var c=e[d==="object"?a:b.idx];c==null&&(c=k[b.idx]),k[b.idx]=m(c,b)}),j?(n=f(j(k)),n[h]=k,n):f(k)},l(g,function(b,e){if(f.fn[b])return;f.fn[b]=function(f){var g=a.type(f),h=b==="alpha"?this._hsla?"hsla":"rgba":c,i=this[h](),j=i[e.idx],k;return g==="undefined"?j:(g==="function"&&(f=f.call(this,j),g=a.type(f)),f==null&&e.empty?this:(g==="string"&&(k=d.exec(f),k&&(f=j+parseFloat(k[2])*(k[1]==="+"?1:-1))),i[e.idx]=f,this[h](i)))}})}),l(c,function(b,c){a.cssHooks[c]={set:function(b,d){d=f(d);if(!j.rgba&&d._rgba[3]!==1){var e,g=c==="backgroundColor"?b.parentNode:b;do e=a.curCSS(g,"backgroundColor");while((e===""||e==="transparent")&&(g=g.parentNode)&&g.style);d=d.blend(e&&e!=="transparent"?e:"_default")}d=d.toRgbaString(),b.style[c]=d}},a.fx.step[c]=function(b){b.colorInit||(b.start=f(b.elem,c),b.end=f(b.end),b.colorInit=!0),a.cssHooks[c].set(b.elem,b.start.transition(b.end,b.pos))}}),a(function(){var a=document.createElement("div"),b=a.style;b.cssText="background-color:rgba(1,1,1,.5)",j.rgba=b.backgroundColor.indexOf("rgba")>-1}),k=a.Color.names={aqua:"#00ffff",azure:"#f0ffff",beige:"#f5f5dc",black:"#000000",blue:"#0000ff",brown:"#a52a2a",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkviolet:"#9400d3",fuchsia:"#ff00ff",gold:"#ffd700",green:"#008000",indigo:"#4b0082",khaki:"#f0e68c",lightblue:"#add8e6",lightcyan:"#e0ffff",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightyellow:"#ffffe0",lime:"#00ff00",magenta:"#ff00ff",maroon:"#800000",navy:"#000080",olive:"#808000",orange:"#ffa500",pink:"#ffc0cb",purple:"#800080",violet:"#800080",red:"#ff0000",silver:"#c0c0c0",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}})(jQuery)