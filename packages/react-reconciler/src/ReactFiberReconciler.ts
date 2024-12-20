import { FiberRoot } from "./ReactInternalTypes";
import { Container } from "ReactDOMHostConfig";
import { createFiberRoot } from "./ReactFiberRoot";

type OpaqueRoot = FiberRoot;

export function createContainer(containerInfo: Container): OpaqueRoot {
  return createFiberRoot(containerInfo);
}
