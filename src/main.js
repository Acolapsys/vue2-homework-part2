import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h
} from "snabbdom";
import { reactive, watchEffect } from "./reactive";

import pic1 from "@/assets/1.png";
import pic2 from "@/assets/2.png";
import pic3 from "@/assets/3.png";
import pic4 from "@/assets/4.png";
import closeIcon from "@/assets/close-icon.svg";

// https://github.com/snabbdom/snabbdom#key--string--number

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
]);

const app = document.getElementById("app");

// eslint-disable-next-line no-unused-vars
const state = reactive({
  personKey: 1
});

// eslint-disable-next-line no-unused-vars
const users = [
  {
    icon: pic1,
    title: "1st person",
    text: "Some very long and abstract description for cute avatar. And some lines more."
  },
  {
    icon: pic2,
    title: "2nd person",
    text: "Some description2"
  },
  {
    icon: pic3,
    title: "3rd person",
    text: "Some description3"
  },
  { icon: pic4, title: "4th person", text: "Some description4" }
];
const personsData = reactive(users);

const personBlock = (data) =>
  h("div.person", [
    h("img.avatar", { props: { src: data.icon } }),
    h("div.text-container", [
      h("h4.title", data.title),
      h("p.text", data.text)
    ]),
    h("img.delete-button", {
      props: { src: closeIcon },
      on: { click: () => { deleteUser(data.title) } }
    })
  ]);

function render() {
  return h("div.wrapper", [
    h(
      "div.container",
      personsData.map((elData, index, arr) =>
        h(
          "div.persons",
          { key: elData.title + elData.text },
          index < arr.length - 1
            ? [personBlock(elData), h("hr")]
            : personBlock(elData)
        )
      )
    ),
    h("button.add-button", { on: { click: addUser } }, "Add user")
  ]);
}

function addUser() {
  const idx = Math.floor(Math.random() * (users.length - 1));
  personsData.push(users[idx]);
}
function deleteUser(title) {
  const idx = personsData.findIndex(el => el.title === title)
  personsData.splice(idx, 1);
}

let previousVnode = null;
watchEffect(() => {
  const vnode = render();
  patch(previousVnode || app, vnode);
  previousVnode = vnode;
});
