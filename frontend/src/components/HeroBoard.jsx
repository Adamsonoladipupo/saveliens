// import { useState } from 'react';
import styles from './HeroBoard.module.css';
// import { Plus, X } from 'lucide-react';

import { useRef, useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { apiFetch, AuthenticationError } from "../services/apiClient";
import { suggestLinkCategory } from "../services/aiService";


export default function HeroBoard({ topics = [], setDashboardData }) {

  const handleAiSuggest = async () => {
    const url = linkUrl.trim();

    try {
      const parsed = new URL(url);

      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid URL");
      }
    } catch {
      setAiError("Enter a valid HTTP or HTTPS URL.");
      return;
    }

    clearAiSuggestion();

    const controller = new AbortController();
    aiRequestRef.current = controller;

    setAiLoading(true);

    try {
      const suggestion = await suggestLinkCategory(
        url,
        controller.signal
      );

      if (controller.signal.aborted) return;

      setAiSuggestion(suggestion);
      setAiError("");
    } catch (error) {
      if (controller.signal.aborted) return;

      if (error instanceof AuthenticationError) {
        navigate("/signin", { replace: true });
        return;
      }

      setAiError(
        error.message || "Unable to generate a suggestion."
      );
    } finally {
      if (aiRequestRef.current === controller) {
        aiRequestRef.current = null;
        setAiLoading(false);
      }
    }
  };




  // const BASE_URL = "http://localhost:8080/api/topic"
  const BASE_URL=`${import.meta.env.VITE_API_BASE_URL}/api/topic`;

  const [linkUrl, setLinkUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);

  const [showNewTopicInput, setShowNewTopicInput] = useState(false);

  const [newTopic, setNewTopic] = useState("");

  const [newTopicDescription, setNewTopicDescription] = useState("");

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    clearAiSuggestion();

    setIsModalOpen(false);
    setSelectedTopic(null);
    setShowNewTopicInput(false);
    setNewTopic("");
    setNewTopicDescription("");
    setLinkUrl("");
  };

  const navigate = useNavigate();
  const aiRequestRef = useRef(null);

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const clearAiSuggestion = () => {
    aiRequestRef.current?.abort();
    aiRequestRef.current = null;

    setAiSuggestion(null);
    setAiLoading(false);
    setAiError("");
  };


const handleAddTopic = async () => {


  const trimmedTopic = newTopic.trim();
  const trimmedDescription = newTopicDescription.trim();

  if (!trimmedTopic) {
    alert("Topic name is required");
    return;
  }

  if (!trimmedDescription) {
    alert("Topic description is required");
    return;
  }

  try {

    const token = sessionStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTopic,
          description: trimmedDescription,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create topic");
    }

    const createdTopic = await response.json();

    setDashboardData((prev) => ({
      ...prev,
      topics: [...prev.topics, createdTopic],
    }));

    setSelectedTopic(createdTopic.id);

    setNewTopic("");

    setNewTopicDescription("");

    setShowNewTopicInput(false);

  } catch (error) {
    console.log(error);
  }
};

const handleSaveLink = async (e) => {

  e.preventDefault();

  if (!linkUrl || !selectedTopic) {
    alert("Please select a topic");
    return;
  }

  try {

    setIsLoading(true);

    const token = sessionStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/${selectedTopic}/links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: linkUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save link");
    }

    const savedLink = await response.json();

    setDashboardData((prev) => ({
      ...prev,

      totalLinks: prev.totalLinks + 1,

      recentlyAddedLinks: [
        savedLink,
        ...(prev.recentlyAddedLinks || []),
      ].slice(0, 5),
    }));

    closeModal();

  } catch (error) {

    console.log(error);

  } finally {

    setIsLoading(false);

  }
};



  return (
    <>

      <section className={styles.hero}>

        <div className={styles.content}>

          <span className={styles.eyebrow}>
            ORGANIZE YOUR LINKS
          </span>

          <h1 className={styles.title}>
            The Creator's Library of
            <br />
            Organized Links.
          </h1>

          <button
            className={styles.addBtn}
            onClick={openModal}
          >
            Add new link
            <Plus size={16} />
          </button>

        </div>

      </section>

      {isModalOpen && (

        <div
          className={styles.overlay}
          onClick={closeModal}
        >

          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className={styles.closeBtn}
              onClick={closeModal}
            >
              <X size={18} />
            </button>

            <h2 className={styles.modalTitle}>
              Add New Link
            </h2>

            <form className={styles.form}  onSubmit={handleSaveLink}>

              <input
                type="url"
                required
                placeholder="Paste your link here..."
                value={linkUrl}
                onChange={(event) => {
                  clearAiSuggestion();
                  setLinkUrl(event.target.value);
                }}
              />




              <div className={styles.aiSection}>
                <button
                  type="button"
                  className={styles.aiButton}
                  onClick={handleAiSuggest}
                  disabled={!linkUrl.trim() || aiLoading || isLoading}
                >
                  <Sparkles size={16} />
                  {aiLoading ? "Analyzing link..." : "Suggest with AI"}
                </button>

                {aiLoading && (
                  <div className={styles.aiSkeleton} aria-live="polite">
                    <div className={styles.aiSkeletonLine} />
                    <div className={styles.aiSkeletonLine} />
                    <div className={styles.aiSkeletonLine} />
                  </div>
                )}

                {aiError && (
                  <p className={styles.aiError} role="alert">
                    {aiError}
                  </p>
                )}

                {aiSuggestion && (
                  <div className={styles.aiResult}>
                    <div className={styles.aiResultHeader}>
                      <Sparkles size={16} />
                      <strong>AI Recommendation</strong>
                    </div>

                    {aiSuggestion.type === "EXISTING_TOPIC" && (
                      <>
                        <p>
                          Suggested topic:{" "}
                          <strong>{aiSuggestion.suggestedTopicName}</strong>
                        </p>

                        <button
                          type="button"
                          className={styles.aiAcceptBtn}
                          onClick={() => {
                            setSelectedTopic(aiSuggestion.suggestedTopicId);
                            setShowNewTopicInput(false);
                          }}
                        >
                          Use this topic
                        </button>
                      </>
                    )}

                    {aiSuggestion.type === "NEW_TOPIC" && (
                      <>
                        <p>
                          Suggested new topic:{" "}
                          <strong>{aiSuggestion.suggestedTopicName}</strong>
                        </p>

                        <p>{aiSuggestion.suggestedTopicDescription}</p>

                        <button
                          type="button"
                          className={styles.aiAcceptBtn}
                          onClick={() => {
                            setNewTopic(aiSuggestion.suggestedTopicName);
                            setNewTopicDescription(
                              aiSuggestion.suggestedTopicDescription
                            );
                            setShowNewTopicInput(true);
                            setSelectedTopic(null);
                          }}
                        >
                          Review new topic
                        </button>
                      </>
                    )}

                    {aiSuggestion.type === "UNCERTAIN" && (
                      <p>
                        We couldn't confidently categorize this link.
                        Please choose a topic manually.
                      </p>
                    )}

                    {aiSuggestion.summary && (
                      <p className={styles.aiSummary}>
                        <strong>Summary:</strong> {aiSuggestion.summary}
                      </p>
                    )}

                    {aiSuggestion.reason && (
                      <p className={styles.aiReason}>
                        {aiSuggestion.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>












              <div className={styles.topicSection}>

                <div className={styles.topicHeader}>
                  <h4>Select Topic</h4>

                  <button
                    type="button"
                    className={styles.addTopicBtn}
                    onClick={() =>
                      setShowNewTopicInput(prev => !prev)
                    }
                  >
                    + Add Topic
                  </button>
                </div>

                {showNewTopicInput && (
                  <div className={styles.newTopicRow}>

                  <input
                    type="text"
                    placeholder="New topic name"
                    value={newTopic}
                    onChange={(e) =>
                      setNewTopic(e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Enter topic description"
                    value={newTopicDescription}
                    onChange={(e) =>
                      setNewTopicDescription(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className={styles.saveTopicBtn}
                    onClick={handleAddTopic}
                  >
                    Save
                  </button>

                </div>
                  
                )}

                <div className={styles.topicGrid}>

                  {topics.map((topic) => (

                    <button
                      key={topic.id}
                      type="button"
                      className={`${styles.topicChip} ${
                        selectedTopic === topic.id
                          ? styles.topicSelected
                          : ""
                      }`}
                      onClick={() =>{
                        setSelectedTopic(topic.id)
                        console.log(topic.id)}
                      }
                    >
                      {topic.title}
                    </button>

                  ))}

                </div>

              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!linkUrl || !selectedTopic || isLoading}
              >
                {isLoading ? "Saving..." : "Save Link"}
              </button>

            </form>

          </div>

        </div>

      )}
    </>
  );
}