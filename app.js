
const P=window.GIAPHA_PEOPLE||[], R=window.GIAPHA_RECORDS||[], D=window.GIAPHA_DUPS||[];
const byId=Object.fromEntries(P.map(x=>[String(x.person_id),x]));
let selected="P00000", mode="local", depth=3;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const val=x=>(x===null||x===undefined||x==="")?"":String(x);
const gen=g=>Number(g)===0?"Tiền tổ":"Đời "+g;
function children(id){return P.filter(x=>String(x.parent_id)===String(id)).map(x=>String(x.person_id))}
function ancestors(id){let a=[],cur=id,guard=0;while(cur&&byId[cur]&&guard++<40){a.push(cur);cur=val(byId[cur].parent_id)}return a}
function descendants(id,n){let all=[id],f=[id];for(let k=0;k<n;k++){let nx=[...new Set(f.flatMap(children))];if(!nx.length)break;all.push(...nx);f=nx}return [...new Set(all)]}
function shown(){
 if(mode==="anc") return ancestors(selected);
 if(mode==="desc") return descendants(selected,depth);
 let ids=[...ancestors(selected),...descendants(selected,2)];
 let p=val(byId[selected]?.parent_id); if(p) ids.push(...children(p));
 return [...new Set(ids)];
}
function pathLabel(){return ancestors(selected).reverse().map(id=>`${gen(byId[id].generation)}: ${byId[id].name}`).join(" › ")}
function nodeHTML(id, allowed){
 let x=byId[id]; if(!x)return "";
 let kids=children(id).filter(k=>allowed.has(k));
 let n=`<div class="node ${id===selected?"selected":""}" data-id="${id}">${x.name}<small>${gen(x.generation)}</small></div>`;
 return `<li>${n}${kids.length?`<ul>${kids.map(k=>nodeHTML(k,allowed)).join("")}</ul>`:""}</li>`;
}
function renderTree(){
 let ids=shown(), allowed=new Set(ids);
 $("#crumb").textContent=pathLabel()||"";
 // roots among shown = nodes whose parent is not shown
 let roots=ids.filter(id=>!val(byId[id]?.parent_id)||!allowed.has(val(byId[id]?.parent_id)));
 $("#tree").innerHTML=`<ul>${roots.map(r=>nodeHTML(r,allowed)).join("")}</ul>`;
 $$(".node").forEach(n=>n.onclick=()=>{selected=n.dataset.id;$("#person").value=selected;renderAll()});
}
function renderProfile(){
 let x=byId[selected]; if(!x)return;
 let rows=[
 ["Mã cá nhân",x.person_id],["Thế hệ",gen(x.generation)],["Cha/nhánh trên",x.parent_name],
 ["Thứ tự trong Sinh hạ",x.child_order],["Sinh",x.birth],["Mất",x.death],["An táng",x.burial],["Ghi chú",x.note]
 ].filter(z=>val(z[1]));
 $("#profile").innerHTML=`<h3>${x.name}</h3>`+rows.map(z=>`<div class="kv"><b>${z[0]}:</b> ${val(z[1])}</div>`).join("");
}
function renderAll(){renderTree();renderProfile();$("#depthbox").style.display=mode==="desc"?"block":"none"}
function fillPeople(){
 let s=$("#person"); s.innerHTML=P.map(x=>`<option value="${x.person_id}">${x.name} — ${gen(x.generation)}${val(x.parent_name)?` — con ${x.parent_name}`:""} [${x.person_id}]</option>`).join("");
 s.value=selected;s.onchange=()=>{selected=s.value;renderAll()}
}
function esc(s){return val(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function renderRecords(){
 let q=$("#recordSearch").value.toLowerCase(), g=$("#genFilter").value;
 let rows=R.filter(x=>(!q||Object.values(x).some(v=>val(v).toLowerCase().includes(q)))&&(!g||String(x.generation)===g));
 $("#recordBody").innerHTML=rows.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.generation)}</td><td>${esc(x.role)}</td><td>${esc(x.household_id)}</td><td>${esc(x.household_head)}</td><td>${esc(x.child_order)}</td><td>${esc(x.birth)}</td><td>${esc(x.death)}</td><td>${esc(x.burial)}</td><td>${esc(x.note)}</td><td>${esc(x.person_id)}</td></tr>`).join("");
 $("#recordCount").textContent=`${rows.length} record`;
}
function renderDups(){
 $("#dupBody").innerHTML=D.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.generation)}</td><td>${esc(x.number_of_distinct_people)}</td></tr>`).join("")
}
$$(".tab").forEach(b=>b.onclick=()=>{$$(".tab,.page").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.page).classList.add("active")});
$$('input[name="mode"]').forEach(r=>r.onchange=()=>{mode=r.value;renderAll()});
$("#depth").oninput=e=>{depth=Number(e.target.value);$("#depthVal").textContent=depth;renderAll()};
$("#recordSearch").oninput=renderRecords;$("#genFilter").onchange=renderRecords;
fillPeople();renderAll();renderRecords();renderDups();
