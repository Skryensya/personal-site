import ScrollStack, { ScrollStackItem } from './ScrollStack';

export function ProyectStack() {
    return (
        <ScrollStack itemDistance={100} itemStackDistance={30} stackPosition="50%" baseScale={0.85} rotationAmount={0} blurAmount={0} useWindowScroll={true}>
            <ScrollStackItem>
                <h2>Card 1</h2>
                <p>This is the first card in the stack</p>
            </ScrollStackItem>
            <ScrollStackItem>
                <h2>Card 2</h2>
                <p>This is the second card in the stack</p>
            </ScrollStackItem>
            <ScrollStackItem>
                <h2>Card 3</h2>
                <p>This is the third card in the stack</p>
            </ScrollStackItem>
        </ScrollStack>
    );
}
