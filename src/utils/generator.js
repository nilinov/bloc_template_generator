import { sampleLoadList } from './sample.load.list.js';
import stateDefaultTemplate from "./state.default.template.js";
import { eventTemplate } from "./event.template.js";
import { blocDefaultTemplate } from "./bloc.default.tempalte.js";
function init() {
    const spans = document.querySelectorAll("pre");
    spans.forEach((span) => {
        span.onclick = function () {
            document.execCommand("copy");
        };
        span.addEventListener("copy", function (event) {
            event.preventDefault();
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", span.innerText);
                // console.log(event.clipboardData.getData("text"))
                console.log('copy success');
            }
        });
    });
    document.querySelector('input#blocName').addEventListener('change', () => {
        updateAll();
    });
    document.querySelector('input#blocItemType').addEventListener('change', () => {
        updateAll();
    });
    const name = document.querySelector('input#blocName').value || (localStorage.name ?? 'Coupon');
    const itemType = document.querySelector('input#blocItemType').value || (localStorage.itemType ?? 'Coupon');
    document.querySelector('input#blocName').value = name;
    document.querySelector('input#blocItemType').value = itemType;
    updateAll();
}
function updateAll() {
    console.log('updateAll');
    const name = document.querySelector('input#blocName').value;
    const itemType = document.querySelector('input#blocItemType').value;
    localStorage.name = name;
    localStorage.itemType = itemType;
    document.getElementById('sample_name').innerText = name;
    document.getElementById('sample_state').innerText = stateDefaultTemplate(sampleLoadList(name, itemType));
    document.getElementById('sample_events').innerText = eventTemplate(sampleLoadList(name, itemType));
    document.getElementById('sample_bloc').innerText = blocDefaultTemplate(sampleLoadList(name, itemType));
}
init();
//# sourceMappingURL=generator.js.map