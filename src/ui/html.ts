import * as svg from "./svg";

export function toElement(html: string) {
    var template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild!;
}

export function toElements(html: string) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.childNodes;
}

export function getInput(
    id: string,
    parent: Element = <Element>document.body
): HTMLInputElement | null {
    return <HTMLInputElement>document.querySelector(`#${id}`);
}

export function get<T>(selectors: string): T {
    return document.querySelector(selectors) as any as T;
}

export function getAll<T>(selectors: string): T {
    return document.querySelectorAll(selectors) as any as T;
}

const cheats_container_style = `position: absolute;
width: fit-content;
top: 100px;
right: 0;
background-color: white;
padding: 10px;
display: flex;
flex-direction: column;
align-items: center;
zoom: 0.65;
border-radius: 6px;`;

export const container = `<div id="cheats_container" style="${cheats_container_style}">
    <div style="align-items: center; display: flex; flex-direction: column;">
        <div id="cheats_collapse" class="collapse card card-body" style="margin-bottom: 5px;">
            <div class="input-group" style="margin-bottom: 5px; justify-content: center;">
                <span class="input-group-text">Add</span>
                <button id="cheats_add_timeline" class="btn btn-primary" type="button">Timeline</button>
                <button id="cheats_add_key" class="btn btn-primary" type="button">Key</button>
            </div>
        </div>
        <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#cheats_collapse" aria-expanded="false" aria-controls="collapse_cheats" style="margin: 5px;">Cheats</button>
    </div>
</div>`;

export const collapseTimeline = (id: number) => `
<div style="align-items: center; display: flex; flex-direction: column; margin-bottom: 5px;" name="input_timeline" id="input_timeline_${id}">
    <div id="timeline_${id}_collapse" class="collapse card card-body" style="margin-bottom: 5px;"></div>
    <div class="input-group">
        <div class="form-check form-switch" style="display: flex; align-items: center;">
            <input id="timeline_${id}_on" class="form-check-input" type="checkbox" role="switch" data-block-id="input_timeline_${id}">
        </div>
        <button class="btn btn-primary cant_lock" type="button" data-bs-toggle="collapse" data-bs-target="#timeline_${id}_collapse" aria-expanded="false" aria-controls="timeline_${id}_collapse" style="border-top-left-radius: 5px; border-bottom-left-radius: 5px;">Show</button>
        <button id="timeline_${id}_add" class="btn btn-primary" type="button">Key</button>
        <button id="timeline_${id}_add_click" class="btn btn-primary" type="button">Click</button>
        <input id="timeline_${id}_time" type="string" class="form-control" placeholder="interval" aria-label="Interval" style="width: 70px; padding: 3px;">
    </div>
</div>`;

export const input_key_group = (id: number) => `
<div style="display: flex; margin-bottom: 0.5em;" name="input_key" id="input_${id}">
    <div class="form-check form-switch" style="display: flex; align-items: center;">
        <input id="input_${id}_on" class="form-check-input" type="checkbox" role="switch" data-block-id="input_${id}">
    </div>
    <div class="input-group">
        <input id="input_${id}_time" type="string" class="form-control" placeholder="interval" aria-label="Interval" style="width: 70px; padding: 3px;">
        <input id="input_${id}_cast" type="string" class="form-control" placeholder="casting" aria-label="Casting" style="width: 70px; padding: 3px;">
        <input id="input_${id}_key" type="string" class="form-control" placeholder="key" aria-label="Key" style="width: 45px; padding: 3px;">
    </div>
</div>
`;

export const input_timeline_group = (parent: string, name: string) => `
<div style="display: flex; width: 234px; margin-bottom: 0.5em;" name="input_${parent}" id="input_${name}">
    <div class="input-group">
        <span class="input-group-text">${svg.key}</span>
        <input name="cast" id="input_${name}_cast" type="string" class="form-control" placeholder="casting" aria-label="Casting" style="width: 45px; padding: 3px;">
        <input name="key" id="input_${name}_key" type="string" class="form-control" placeholder="key" aria-label="Key" style="width: 20px; padding: 3px;">
        <button id="input_${name}_remove" type="button" class="btn btn-secondary" aria-label="Close" data-block-id="input_${name}">x</button>
    </div>
</div>
`;

export const click_timeline_group = (parent: string, name: string) => `
<div style="display: flex; width: 234px; margin-bottom: 0.5em;" name="input_${parent}" id="input_${name}">
    <div class="input-group">
        <button id="input_${name}_pos" type="button" class="btn btn-info">${svg.mouse}</button>
        <input name="x" id="input_${name}_x" type="string" class="form-control" placeholder="x" aria-label="X" style="width: 45px; padding: 3px;">
        <input name="y" id="input_${name}_y" type="string" class="form-control" placeholder="y" aria-label="Y" style="width: 20px; padding: 3px;">
        <button id="input_${name}_remove" type="button" class="btn btn-secondary" aria-label="Close" data-block-id="input_${name}">x</button>
    </div>
</div>
`;
