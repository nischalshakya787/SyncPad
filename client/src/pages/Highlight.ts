import Quill from "quill";

let Inline = Quill.import("blots/inline");

export default class Highlight extends Inline {
  static create(value: any) {
    const node = super.create();
    node.setAttribute("class", "highlighted-text");
    return node;
  }
}
Highlight.blotName = "highlight";
Highlight.tagName = "highlight";
