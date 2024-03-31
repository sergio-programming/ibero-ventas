"use strict";

import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";
import Workspace from "./workspace";

const router = new Workspace();
Workspace.router = router;

$(() => {
	if (!Backbone.history.start()) {
		router.navigate("login", { trigger: true });
	}
});
