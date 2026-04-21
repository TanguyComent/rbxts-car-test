import { deepCopy } from "@rbxts/object-utils";

export namespace MathUtils {
    export function getBezierPosition(controllPoints: Vector3[], t: number): Vector3 {
        assert(controllPoints.size() >= 2, "At least two control points are required to compute a Bezier position.");
        let temp = deepCopy(controllPoints);

        while (temp.size() > 1) {
            const nextVectors: Vector3[] = [];
            for (let i = 0; i < temp.size() - 1; i++) {
                nextVectors.push(temp[i].Lerp(temp[i + 1], t));
            }
            temp = nextVectors;
        }

        return temp[0];
    }

    export function getBezierDirection(controllPoints: Vector3[], t: number): Vector3 {
        const delta = 0.0001;
        const point1 = getBezierPosition(controllPoints, math.clamp(t - delta, 0, 1));
        const point2 = getBezierPosition(controllPoints, math.clamp(t + delta, 0, 1));
        return point2.sub(point1).Unit;
    }

    export function getApproximatedBezierLength(controllPoints: Vector3[], precision: number = 100): number {
        assert(controllPoints.size() >= 2, "At least two control points are required to compute a Bezier length.");
        let length = 0;
        let previousPoint = controllPoints[0];

        for (let i = 1; i <= precision; i++) {
            const t = i / precision;
            const currentPoint = getBezierPosition(controllPoints, t);
            length += previousPoint.sub(currentPoint).Magnitude;
            previousPoint = currentPoint;
        }

        return length;
    }

    export function binomial(n: number, k: number): number {
        let res = 1;
        for (let i = 0; i < k; i++) {
            res *= (n - i);
            res /= (i + 1);
        }
        return res;
    }
    }