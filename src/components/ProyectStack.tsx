export function ProyectStack() {
    return (
        <div className="flex flex-col gap-4">
            <div className="p-4 bg-secondary border-2 border-main">
                <h2 className="text-xl font-bold">Card 1</h2>
                <p>This is the first card in the stack</p>
            </div>
            <div className="p-4 bg-secondary border-2 border-main">
                <h2 className="text-xl font-bold">Card 2</h2>
                <p>This is the second card in the stack</p>
            </div>
            <div className="p-4 bg-secondary border-2 border-main">
                <h2 className="text-xl font-bold">Card 3</h2>
                <p>This is the third card in the stack</p>
            </div>
        </div>
    );
}
