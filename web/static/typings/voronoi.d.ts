// Type definitions for voronoi 1.0.0
// Project: https://github.com/gorhill/Javascript-Voronoi
// Definitions by: Michael Neu <https://github.com/michaelneu>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace Voronoi {
  interface Vertex {
    x: number;
    y: number;
  }

  type Site = Vertex;

  interface Edge {
    /**
     * The Voronoi site object at the left of this Voronoi.Edge object. The
     * site object is just a reference to a site in the array of sites supplied
     * by the user when Voronoi.compute() was called.
     */
    lSite: Site;

    /**
     * The Voronoi site object at the right of this Voronoi.Edge object (can be
     * null, when this is a border edge). The site object is just a reference
     * to a site in the array of sites supplied by the user when
     * Voronoi.compute() was called.
     */
    rSite: Site;

    /**
     * A Voronoi.Vertex object with an x and a y property defining the start
     * point (relative to the Voronoi site on the left) of this Voronoi.Edge
     * object.
     */
    va: Vertex;

    /**
     * A Voronoi.Vertex object with an x and a y property defining the end
     * point (relative to Voronoi site on the left) of this Voronoi.Edge
     * object.
     */
    vb: Vertex;
  }

  interface Cell {
    /**
     * The Voronoi site object associated with the Voronoi cell.
     */
    site: Site;

    /**
     * An array of Voronoi.Halfedge objects, ordered counterclockwise, defining
     * the polygon for this Voronoi cell.
     */
    halfedges: Halfedge[];
  }

  interface Halfedge {
    /**
     * The Voronoi site object owning this Voronoi.Halfedge object.
     */
    site: Site;

    /**
     * A reference to the unique Voronoi.Edge object underlying this
     * Voronoi.Halfedge object.
     */
    edge: Edge;

    /**
     * A method returning a Voronoi.Vertex of the start point of this halfedge.
     * Keep in mind halfedges are always counterclockwise.
     */
    getStartpoint() : Vertex;

    /**
     * A method returning a Voronoi.Vertex object with an x and a y property
     * for the end point of this halfedge. Keep in mind halfedges are always
     * counterclockwise.
     */
    getEndpoint() : Vertex;
  }

  interface BorderBox {
    /**
     * X left
     */
    xl: number;

    /**
     * X right
     */
    xr: number;

    /**
     * Y top
     */
    yt: number;

    /**
     * Y bottom
     */
    yb: number;
  }

  interface Diagram {
    /**
     * An array of unordered, unique Voronoi.Vertex objects making up the
     * Voronoi diagram. Each Voronoi.Vertex object in the list is shared by
     * many Voronoi.Edge objects.
     */
    vertices: Vertex[];

    /**
     * An array of unordered, unique Voronoi.Edge objects making up the Voronoi
     * diagram. Voronoi.Edges are defined by two vertices, va and vb, which
     * vertices are shared by connected edges. This mean that if you change one
     * vertex belonging to an edge, other connected edges will also be changed.
     */
    edges: Edge[];

    /**
     * An array of Voronoi.Cell objects making up the Voronoi diagram. A
     * Voronoi.Cell object might have an empty array of halfedges, meaning no
     * Voronoi cell could be computed for a particular cell.
     */
    cells: Cell[];

    /**
     * The time it took to compute the Voronoi diagram, in milliseconds.
     */
    execTime: number;
  }
}

/**
 * The Voronoi object which computes a Voronoi diagram.
 */
declare class Voronoi {
  constructor();

  public compute(sites: Voronoi.Site[], borderBox: Voronoi.BorderBox) : Voronoi.Diagram;
  public recycle(diagram: Voronoi.Diagram) : void;
}

export = Voronoi;