
import React, { useEffect, useContext } from 'react'
import OverlayContext from './OverlayContext';

import * as d3 from "d3"
/**
 * Trigger the specified event on the specified element.
 * @param  {Object} elem  the target element.
 * @param  {String} event the type of the event (e.g. 'click').
*/
function triggerEvent(elem, event) {
    const clickEvent = new Event(event); // Create the event.
    elem.dispatchEvent(clickEvent);    // Dispatch the event.
}

function D3HierarchyTree(props) {
    const { data } = props;
    const { setisDetailsClosed, setOpenUbicationBtn, setCurrentNodeSelected, setTabState } = useContext(OverlayContext);
    const tree = d3.tree;
    const hierarchy = d3.hierarchy;
    const select = d3.select;
    const number = 0;
    const translate = 'translate(';
    const propertyOpacity = 'fill-opacity';
    let margin = { left: number, right: number, top: number, bottom: number };
    let width = number;
    let height = number;
    let barHeight = number;
    let i = number;
    let duration = number;
    let root;
    let svg;
    let newTree;
    let currentClicked;
    let currentClickedParent;

    const appendNodeEnterForms = (nodeEnter) => {
        nodeEnter
            .append("circle")
            .attr("r", 1e-6)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });
        nodeEnter.append("text")
            .on("click", function () {

                const padding = 2;
                if (currentClickedParent !== undefined) {

                    d3.select(currentClicked)
                        .attr("class", "node")

                    const child = currentClickedParent.querySelector('.hierarchy-rect-svg');
                    if (child !== null) {
                        d3.select(child)
                            .remove()
                    }
                    /**Remove rect */
                    currentClicked = this;
                    currentClickedParent = currentClicked.parentElement;
                    const bbox = currentClicked.getBBox();

                    d3.select(currentClickedParent)
                        .append("rect", "text")
                        .attr("x", bbox.x - padding)
                        .attr("y", bbox.y - padding)
                        .attr("width", "70%")
                        .attr("height", bbox.height + (padding * 2))
                        .attr("class", "hierarchy-rect-svg");

                    d3.select(currentClicked)
                        .attr("class", "node node-active");
                } else {
                    currentClicked = this;
                    currentClickedParent = currentClicked.parentElement;
                    const bbox = currentClicked.getBBox();
                    d3.select(currentClickedParent)
                        .append("rect", "text")
                        .attr("x", bbox.x - padding)
                        .attr("y", bbox.y - padding)
                        .attr("width", "70%")
                        .attr("height", bbox.height + (padding * 2))
                        .attr("class", "hierarchy-rect-svg");
                    d3.select(currentClicked)
                        .attr("class", "node node-active");
                }
            })
            .attr("x", 10)
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return "start";
            })
            .attr("id", function (d) {
                return d.data.name;
            })
            .text(function (d) {
                if (d.data.name.length > 100) {
                    return d.data.name.substring(0, 100) + "...";
                } else {
                    return d.data.name;
                }
            })
            .style(propertyOpacity, 1e-6);
        nodeEnter.append("svg:title").text(function (d) {
            return d.data.name;
        });
    };

    const getX0AndY0 = (source, XorY) => {
        if (source.currentTarget) {
            return XorY === "X" ? source.currentTarget.__data__.x0 : source.currentTarget.__data__.y0;
        }

        return XorY === "X" ? source.x0 : source.y0;
    };

    function update(source) {
        width = 800;
        // Compute the new tree layout.
        const nodes = newTree(root);
        const nodesSort = [];
        nodes.eachBefore(function (n) {
            nodesSort.push(n);
        });

        height = Math.max(100, (nodesSort.length) * barHeight + margin.top + margin.bottom);

        const links = nodesSort.slice(1);
        // Compute the "layout".
        nodesSort.forEach((n, i) => {
            n.x = i * barHeight;
        });

        d3.select("#node-list").attr("height", height);

        // Update the nodes…
        const node = svg.selectAll("g.node").data(nodesSort, function (d) {
            return d.id || (d.id = ++i);
        });

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")

            .attr("transform", function () {
                return `${translate}${getX0AndY0(source, "Y")},${getX0AndY0(source, "X")})`;
            })
            .on("click", click);

        appendNodeEnterForms(nodeEnter);

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter);
        nodeUpdate.attr("transform", function (d) {
            return `${translate}${d.y},${d.x})`;
        });

        nodeUpdate
            .select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeUpdate.select("text").style(propertyOpacity, 1);

        // Transition exiting nodes to the parent's new position (and remove the nodes)
        const nodeExit = node.exit();

        nodeExit
            .attr("transform", function (d) {
                return `${translate}${source.y},${source.x})`;
            })
            .remove();

        nodeExit.select("circle").attr("r", 1e-6);

        nodeExit.select("text").style(propertyOpacity, 1e-6);

        // Update the links…
        const link = svg.selectAll("path.link").data(links, function (d) {
            // return d.target.id;
            const id = `${d.id}->${d.parent.id}`;
            return id;
        });

        // Enter any new links at the parent's previous position.
        const linkEnter = link
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", (d) => {
                const o = {
                    x: d.x,
                    y: d.y,
                    parent: { x: d.parent.x0, y: d.parent.y0 }
                };
                return connector(o);
            });

        // Transition links to their new position.
        link.merge(linkEnter).attr("d", connector);

        // // Transition exiting nodes to the parent's new position.
        link
            .exit()
            .attr("d", (d) => {
                const o = {
                    x: source.x,
                    y: source.y,
                    parent: { x: source.x, y: source.y }
                };
                return connector(o);
            })
            .remove();

        // Stash the old positions for transition.
        nodesSort.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    const connector = function (d) {
        //straight
        return "M" + d.parent.y + "," + d.parent.x + "V" + d.x + "H" + d.y;
    };
    function onInit() {
        margin = { top: 20, right: 10, bottom: 20, left: 10 };
        width = 520 - margin.right - margin.left;
        height = 2000 - margin.top - margin.bottom;
        barHeight = 20;
        i = 0;
        duration = 750;
        newTree = tree().size([width, height]);
        newTree = tree().nodeSize([0, 30]);
        root = newTree(hierarchy(data));
        root.each((d) => {
            d.name = d.id; //transferring name to a name letiable
            d.id = i; //Assigning numerical Ids
            i++;
        });
        root.x0 = root.x;
        root.y0 = root.y;

        svg = select("#hierarchy-container")
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "node-list")
            .append("g")
            .attr("transform", `${translate}${margin.left},${margin.top})`);

        root.children.forEach(collapse);
        update(root);
    }

    const click = (d) => {
        setTabState({
            tab1: true,
            tab2: false,
        });
        const currentTarget = d.currentTarget.__data__;
        setCurrentNodeSelected(currentTarget.data);
        if (currentTarget.data.hasOwnProperty('TYPE')) {
            setOpenUbicationBtn(true);
        } else {
            setOpenUbicationBtn(false);
        }
        setisDetailsClosed(false);

        if (currentTarget.children) {
            currentTarget._children = currentTarget.children;
            currentTarget.children = null;
        } else {
            currentTarget.children = currentTarget._children;
            currentTarget._children = null;
        }
        update(d);
    };


    const collapse = (d) => {

        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    };
    useEffect(() => {
        onInit();
    }, []);

    return (
        <>
            <div id="d3-content" className="d3-content pointer-events">

                <div className="hierarchy-container inner " id='hierarchy-container'></div>
            </div>
        </>
    );
};

export default D3HierarchyTree;
