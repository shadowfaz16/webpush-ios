import Image from "next/image";

function Instruction(props: {
  index: number;
  caption: string;
  captionHeight?: number;
}) {
  return (
    <figure
      className="relative border-t-2 border-gray-300 mb-8"
      style={{ paddingBottom: "100%" }}
    >
      <figcaption
        className={`absolute w-full leading-16 h-16 top-0 flex items-center text-left justify-start text-muted text-sm`}
      >
        <span className="text-text mr-4 whitespace-nowrap">{`Step ${props.index}:`}</span>
        {props.caption}
      </figcaption>
      <Image
        style={{ top: 0 }}
        src={`/ios_step_${props.index}.jpg`}
        alt={`ios step ${props.index}`}
        className={`object-contain pt-16`}
        fill
      />
    </figure>
  );
}

export default function IosInstructionalStatic() {
  return (
    <>
      <h2
        className="text-center h-12 uppercase text-xs flex items-center justify-center"
        style={{ letterSpacing: "2px" }}
      >
        Installation instructions
      </h2>
      <section className="w-full max-w-xs mx-auto">
        <Instruction index={1} caption={"In Safari or chrome, click the 'share' button"} />
        <Instruction index={2} caption={"Click 'Add to Home Screen'"} />
        <Instruction index={3} caption={"Review settings and click 'Add'"} />
        <Instruction index={4} caption={"Launch app from home screen"} />
      </section>
    </>
  );
}
