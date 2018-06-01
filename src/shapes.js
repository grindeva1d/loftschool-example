// x, y, size, strokeColor, strokeWidth, fillColor

class Shape {
    constructor(x, y, size) {
        this.setPosition(x, y);
        this.setSize(size);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(size) {
        this.size = size < 0 ? 0 : size;
    }

    setStrokeColor(color) {
        this.strokeColor = color;
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    setStrokeWidth(width) {
        this.strokeWidth = width;
    }

    canRender() {
        return (
            Number.isFinite(this.size) &&
            Number.isFinite(this.x) &&
            Number.isFinite(this.y)
        );
    }

    render(ctx) {
        throw new Error("this is an abstract shape");
    }
}

class Circle extends Shape {
    render(ctx) {
        ctx.beginPath();

        ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI, false);

        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }

    havePoint(x, y) {
        return ((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y)) < ((this.size / 2) * (this.size / 2));
    }
}

class Quad extends Shape {
    render(ctx) {
        ctx.beginPath();

        ctx.rect(
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }

    havePoint(x, y) {
        const leftX = this.x - (this.size / 2) - this.strokeWidth;
        const rightX = this.x + (this.size / 2) + this.strokeWidth;
        const topY = this.y - (this.size / 2) - this.strokeWidth;
        const bottomY = this.y + (this.size / 2) + this.strokeWidth;

        return x >= leftX && x <= rightX && y >= topY && y <= bottomY;
    }
}

class Triangle extends Shape {
    render(ctx) {
        ctx.beginPath();

        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();

        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }

    setPosition(x, y) {
        
        this.pointUp = { x: x, y: y + (-this.size / 2) };
        this.pointRight = { x: x + (this.size / 2), y: y + (this.size / 2) };
        this.pointLeft = { x: x + (-this.size / 2), y: y + (this.size / 2) };

        Shape.prototype.setPosition.call(this, x, y);
    }

    sign(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    havePoint(x, y) {

        const pt = { x: x, y: y };
        const b1 = this.sign(pt, this.pointUp, this.pointRight) < 0;
        const b2 = this.sign(pt, this.pointRight, this.pointLeft) < 0;
        const b3 = this.sign(pt, this.pointLeft, this.pointUp) < 0;

        return ((b1 == b2) && (b2 == b3));
    }
}
